# this is purely for testing purposes of the langchain serving
from langchain import LLMChain, OpenAI, SerpAPIWrapper
from langchain.agents import AgentExecutor, Tool, ZeroShotAgent
import pinecone
import openai
import numpy as np
import os
from dotenv import load_dotenv
import os
from collections import deque
from typing import Dict, List, Optional, Any

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
import requests 


from elevenlabs import generate as generate_voice, set_api_key, voices

import whisper_timestamped as whisper

# # Azure Blob
# from azure.storage.blob import BlobServiceClient

# from datetime import datetime, timedelta
# import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
PINECONE_ENVIRONMENT= os.getenv("PINECONE_ENVIRONMENT")

# ELEVENLABS
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
set_api_key(ELEVENLABS_API_KEY)

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
        
        pinecone.init(
            api_key=PINECONE_API_KEY,  # find at app.pinecone.io
            environment=PINECONE_ENVIRONMENT,  # next to api key in console
        )

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
            template="""You are an expiratity date estimator, given this list of inputs of food ingredients,1.Identify the food ingrediants and 2.extimate when the food ingredients will expire in No.days E.g 30days 7days 90days.Then convert it to number of days.

            Some Examples of ingrediants to estimate their expiration date:

            my inventory of ingrediants:\n{ingredients}\n
            Use only these names above to get expiration date of each ingrediant.""",
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
            "Name": { "type": "string","description":"Only extract food ingrediants. ingrediants" },
            "Quantity": { "type": "integer" },
            "Days_to_expire": { "type": "integer","description":"Estimated days the ingrediant will expire in number of days E.g 30days, 14days"}
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



@app.post("/generate")
async def generate(inputBody: InputModel) -> dict:
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
    # Honestly this can change
    return {
        "expire": output,
    }

@app.post("/RecipeSteps")
async def expire(inputBody: InputModel) -> dict:
    input = inputBody.input
    print(input)
    example_input = ['']
    videoGenerator = VideoGenerator(llm=ChatOpenAI(model_name=MODEL_NAME, temperature=TEMPERATURE))
    output = videoGenerator.expire(input)
        
    return [{
    "label" : "Pasta alla Gricia Recipe",
    "image_object":{
        "url":"https://edamam-product-images.s3.amazonaws.com/web-img/bb5/bb5bad0cbcb94ad2ef0895d444f30291.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEI3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIAkAhWvsDscDsNhxcTC6GXyZ8cizVZoVssMdSrxvLJxuAiACTN4k9WfpNxn3HyPzLhVlYBGDgtXQI9q4tIQfwMo0ZCq5BQhWEAAaDDE4NzAxNzE1MDk4NiIMfC2AKQuPHxGRdQcxKpYFwJw%2BPYvxUlq7RCeNuQq%2ByYBOPqOcXWHsuN9RA3aZqyTzGzEFYjnnhVHGqx72KDQuBgZofxn%2BZO1go3SjVdBYLJ0b2lncEPWlXjHqUDB7SFcoC9AfDZqeXRHgwjvM6B7T4DUl7%2BF%2FvB5b7AVfr6rP8YX%2B5czoPcryDpeeqw4Zz3NKhCuDiFU4P5hnM%2FwY3aKtxKhBAlYeJoEEUh1BaCpH61doTMqVYE6w5Mh2klAHREmGbEE0DFR5vGLrXZDGw8c%2FX%2FE4FIyDLto58i%2FPodCZE6BOVc1fGXLNPvNvwJhi4Lz6eMzJmDmoQ57g%2F5ZL78euYIWjIhKOraQUVltVinY%2FdazUuClmuKZQxQwEgH%2FoPkY6GaZFb3XBL3K6bdc7iXKiT2VA1s0WBLPro4wsWNCvA31xKzJYkbKvytqcSxNL1r%2BypfNAY%2BB1Iz19hf3rG%2B%2Fdf6eDX8F6L3USXNIIn%2FsCN4IbZM4tObuYiZJcsA%2FiTvyEAtiPp8dJNOzF7lqO3s9nccAvBwf1vJTuX6Cn%2BY0PNcatE6SnlteejxA7JJeDQup9SkPQv77SRi60FiNsrB2efSow3z4o04NAaGJ%2BjrawHnlYazCySg8kQwfVqEXgasNXhriFAf3BEBkDo1ftKZ2T%2FflxqxA53c8eQCvTJSKGK%2Fj9UQ%2FKrY%2BWc9ADdv0dfruLJzb4jVQiWYTCRa88OlqAYXG0JdfA26nfCXzH9lBHhRvJkmddAslA4Qrrhe1cA7IViymV18F9EtYQdLiPb%2BGTv6NF5Ew%2FSUqBOeJRUo7oILhRxya9hw9U1mKyoVV6iSIkP0DpAKBHeGt5yG185QDqaAf02S4oerqzWE7XQ3addAgSn1FmUEEL41cgkMCQZiT8M3ezwSUwkYCmpwY6sgGY5sPCjhZErEJRa8iBbILMXL9bmEO3zp3QpAifRVePl5u%2BU7%2B%2B9CSN2DTXvxsWlUjwTGNil4HXnkvLx0Cy59GYibZ4Qqo%2FXH95swwAWLK8Aac93QnbMJHXt4gLgayD4jGEnys0cYCQpk2ctTTWi3S9zPL232pczLFa2A3ErB5R%2BVP%2FWkdRB6B7r2oizNCD980Ylx9Vy2NWFcryBY%2FgpsYHYdPjhNM0mBfzVLUJt5Hs35l5&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230826T053304Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFL6U7OTOK%2F20230826%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c03692f5b0fa33f7ff90d4f2fa161e5c4439b043769b96b8de05195f5d499b6e",
        "width":200,
        "height":200
    },
    "Recipe_steps_url":"https://www.seriouseats.com/pasta-alla-gricia",
    "ingredientLines":[
        "1/2 cup butter, softened",
        "1/2 cup white sugar",
        "Apple",
        "1 1/2 to 2 ounces of guanciale"
    ],
    "steps":"""Steps:
1. Preheat the oven to 350�F (175�C).
2. In a mixing bowl, combine the softened butter and white sugar. Mix until well combined.
3. Core and slice the apple into thin slices.
4. In a separate pan, cook the guanciale until crispy. Remove from heat and set aside.
5. Spread the butter and sugar mixture onto one side of each apple slice.
6. Place the apple slices onto a baking sheet lined with parchment paper, buttered side up.
7. Bake in the preheated oven for about 15-20 minutes, or until the apples are golden and slightly caramelized.
8. Remove from the oven and let cool for a few minutes.
9. Serve the caramelized apple slices with the crispy guanciale on top.
10. Enjoy your Pasta alla Gricia!""",
    "calories" : 679.23435266,
    "cuisineType" : "Italian",
    "healthLabels" : [
        "Sugar-Conscious",
        "Peanut-Free",
        "Tree-Nut-Free",
        "Alcohol-Free"
    ],
    "mealType" : "lunch/dinner",
    "dishType" : "main course"
}]

