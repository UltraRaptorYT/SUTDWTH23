# this is purely for testing purposes of the langchain serving
from langchain import LLMChain, OpenAI, SerpAPIWrapper
from langchain.agents import AgentExecutor, Tool, ZeroShotAgent
import openai
import numpy as np
import os
from dotenv import load_dotenv
import os
from collections import deque
from typing import Dict, List, Optional, Any
import uvicorn

from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import BaseLLM
from langchain.vectorstores.base import VectorStore
from pydantic import BaseModel, Field
from langchain.chains.base import Chain
# Langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.document_loaders import TextLoader
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA, LLMChain ,LLMCheckerChain
from langchain.callbacks import wandb_tracing_enabled
from langchain.prompts import (
    PromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.prompts.few_shot import FewShotPromptTemplate

from typing import Optional
from langchain.chains import SimpleSequentialChain ,SequentialChain
from langchain.agents import AgentExecutor, Tool, ZeroShotAgent
from langchain.agents import AgentType, initialize_agent,AgentExecutor
from langchain.tools import tool
from langchain.chains.openai_functions import (
    create_openai_fn_chain,
    create_structured_output_chain,
)
from langchain.schema import HumanMessage, AIMessage, ChatMessage
# from lcserve import serving

# Replace these values with your actual Supabase URL and API key
SUPABASE_URL = "https://vrknhtfxcpwbydarczll.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZya25odGZ4Y3B3YnlkYXJjemxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4MDAyNjUsImV4cCI6MjAwODM3NjI2NX0.a_BdTMR9eN7Cm0tOjLXYAVeNECYU7ZqbHLtIxZGqmso"
from supabase import create_client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# from elevenlabs import generate as generate_voice, set_api_key, voices

# import whisper_timestamped as whisper

# # Azure Blob
# from azure.storage.blob import BlobServiceClient

# from datetime import datetime, timedelta
# import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

# App
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_NAME = "gpt-3.5-turbo-0613"
TEMPERATURE = 0.0
class VideoGenerator:
    
    # task_list: deque = Field(default_factory=deque)
    video_chain2: Chain = Field(default_factory=Chain)
    
    def __init__(self,llm):
        

        index_name = "singlife"

        embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
        # if you already have an index, you can load it like this
        docsearch = Pinecone.from_existing_index(index_name, embeddings)
        self.retriever = docsearch.as_retriever(search_type="mmr")

        self.task_list = deque([{"task_id": 1, "task_name": "Extract relevant documents from Pinecone based on objective"}, {"task_id": 2, "task_name": "Format information to generate 15-30sec video script. VideoStyle: Funny and sarcastic, parse out as JSON output."}])
        json_schema2 = {
            "name": "format_video_script",
            "description": "Formats to a 15-30sec video script.",
            "type": "object",
            "properties": {
            "list_of_scenes": {
                "type": "array",
                "items": {
                "type": "object",
                "properties": {
                    "scene": {
                    "type": "string",
                    "description": "Scene description for video should be visual and general. Max 5 words"
                    },
                    "subtitles": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "description": "video subtitles script for video"
                    }
                    }
                },
                "required": ["scene", "subtitles"]
                }
            }
            },
            "required": ["list_of_scenes"]
        }

        video_prompt_style ="Funny and sarcastic"
        video_prompt = PromptTemplate(
            template="""Goal:Generate 15-30sec video script based on custom knowledge base (Information below) and user query. Two components 1.Scene assets descriptions (Max 5 words) 2.Subtitle script 
            Custom knowledge base:{relevant_documents}\n\nUsing the above information, generate a video script that addresses this user query:\n\n"{query}".\nReturn the generated video script in the style/format: Funny and sarcastic""",
            input_variables= ["relevant_documents", "query"]
        )
        expire_prompt = PromptTemplate(
            template="""You are an expiratity date estimator, given this list of inputs of food ingredients, estimate based on today date 2023-08-26 when the food ingredients will expire. Example output:
            \nmy inventory of ingrediants:{ingredients}""",
            input_variables= ["ingredients"]
        )
        self.video_chain2 = create_structured_output_chain(json_schema2, llm, video_prompt, verbose=True)

        json_schema= {
    "name": "estimate expiration date",
    "description": "Given ingrediants and their Quantity, estimate the expiration date of each ingrediant",
    "type": "object",
    "properties": {
      "list_of_ingrediants": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "Name": { "type": "string" },
            "Quantity": { "type": "integer" },
            "Expiration": { "type": "string", "format": "date" }
          },
          "required": ["Name", "Quantity", "Expiration"]
        }
      }
    },
    "required": ["list_of_ingrediants"]
  }
  
        self.expire_chain = expire_chain = create_structured_output_chain(json_schema, llm, expire_prompt, verbose=True)

    def print_task_list(self):
        print("\033[95m\033[1m" + "\n*****TASK LIST*****\n" + "\033[0m\033[0m")
        for t in self.task_list:
            # print('t: ', t)
            print(str(t["task_id"]) + ": " + t["task_name"])

    def print_next_task(self, task: Dict):
        print("\033[92m\033[1m" + "\n*****NEXT TASK*****\n" + "\033[0m\033[0m")
        print(str(task["task_id"]) + ": " + task["task_name"])

    def print_task_result(self, result: str):
        print("\033[93m\033[1m" + "\n*****TASK RESULT*****\n" + "\033[0m\033[0m")
        print(result)

      
    def getPineconeRelevantDocuments(self,query):
        """
        Parameters:
            query (str): query to search for relevant documents in database
        Returns:
            relevant_documents (str): relevant documents in database based on query
        """
        relevant_documents = ""
        matched_docs = self.retriever.get_relevant_documents("I am travelling to Japan for a ski trip with my family next week.What kind of travel insurance coverage do we need?")

        for i, d in enumerate(matched_docs):
            # print(f"\n## Document {i}\n")
            # print(d.page_content)
            relevant_documents += f'\n## Document {i}\n {d.page_content}'
            
        return relevant_documents
    
    def generate(self,query):
        self.print_task_list()
        
        # Step 1: Pull the first task
        task = self.task_list.popleft()
        self.print_next_task(task)

        relevant_documents = self.getPineconeRelevantDocuments(query)
        
        self.print_task_result(relevant_documents)
        
        # Step 2: Add the next task
        self.print_next_task(task)
        results = self.video_chain2.run(relevant_documents=relevant_documents, query=query)
        self.print_task_result(results)

        # check if results is a string or a dict
        if not isinstance(results, dict):
            print(f'warning, results is not a dict, it is a {type(results)}')

        return results
    
    def expire(self,ingredients):
        results = self.expire_chain.run(ingredients = ingredients)
        return results

    
class InputModel(BaseModel):
    input: str



@app.get("/")
async def test():
    return "test"

@app.post("/generate")
async def generate(inputBody: InputModel) -> dict:
    print('hi')
    input = inputBody.input
    print(input)
    output = input
    # videoGenerator = VideoGenerator(llm=ChatOpenAI(model_name=MODEL_NAME, temperature=TEMPERATURE))
    # output = videoGenerator.generate(input)
        
    return {
        "video": output,
        # "audio": blob_uri,
        # "srt": srt_file
    }

@app.post("/expire")
async def expire(inputBody: InputModel) -> dict:
    input = inputBody.input
    print(input)
    videoGenerator = VideoGenerator(llm=ChatOpenAI(model_name=MODEL_NAME, temperature=TEMPERATURE))
    output = videoGenerator.expire(input)
        
    return {
        "expire": output,
        # "audio": blob_uri,
        # "srt": srt_file
    }
