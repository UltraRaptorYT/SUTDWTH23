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

from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import BaseLLM
from langchain.vectorstores.base import VectorStore
from pydantic import BaseModel, Field
from langchain.chains.base import Chain
# Langchain
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
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

# # Azure Blob
# from azure.storage.blob import BlobServiceClient

# from datetime import datetime, timedelta
# import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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

        expire_prompt = PromptTemplate(
            template="""You are an expiratity date estimator, given this list of inputs of food ingredients,1.Identify the food ingrediants and 2.extimate when the food ingredients will expire in No.days E.g 30days 7days 90days.Then convert it to number of days.

            Some Examples of ingrediants to estimate their expiration date:

            my inventory of ingrediants:\n{ingredients}\n
            Use only these names above to get expiration date of each ingrediant.""",
            input_variables= ["ingredients"]
        )
        recipe_prompt = PromptTemplate(
    template="""You are chef writing down steps based on food details. You have to write steps for every dishes based on the each details given. Each dish name is "label".The dishes are: {recipe_details}\nGenerate steps for each dish notated as one json object in the list""",
    input_variables= ["recipe_details"]
)
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
        recipe_json_schema= {
            "name": "Write recipe Steps",
            "description": "writing down steps based on food details",
            "type": "object",
            "properties": {
            "list_of_ingrediants": {
                "type": "array",
                "items": {
                "type": "object",
                "properties": {
                    "index": { "type": "integer" },
                    "label": { "type": "string","description":"Name of the dish based on details given. Do not change from details" },
                    "steps": { "type": "string","description":"Steps: 1.\n2.\n3.\n4\n5.\n (and so on till the end of the recipe)"}
                },
                "required": ["index", "label", "steps"]
                }
            }
            },
            "required": ["list_of_ingrediants"]
        }
          
        self.expire_chain = create_structured_output_chain(json_schema, llm, expire_prompt, verbose=True)
        self.recipe_step_chain = create_structured_output_chain(recipe_json_schema, llm, recipe_prompt, verbose=True)
      
    
    def expire(self,ingredients):
        results = self.expire_chain.run(ingredients = ingredients)
        return results
    
    def RecipeSteps(self,recipe_details):
        results = self.recipe_step_chain(recipe_details = recipe_details)
        return results

    
class InputModel(BaseModel):
    input: str


@app.post("/expire")
async def expire(inputBody: InputModel) -> dict:
    input = inputBody.input
    print(input)
    videoGenerator = VideoGenerator(llm=ChatOpenAI(model_name=MODEL_NAME, temperature=TEMPERATURE))
    output = videoGenerator.expire(input)
    print('output: ', output)
    # Example /expire
    """
    {'list_of_ingrediants': [{'Name': 'ENR WHT BREAD 600G',
   'Quantity': 3,
   'Days_to_expire': 7},
    {'Name': 'PASAR CHINA YA PEAR', 'Quantity': 3, 'Days_to_expire': 30},
    {'Name': 'FP RED SPINACH', 'Quantity': 1, 'Days_to_expire': 7},
    {'Name': 'Oranges', 'Quantity': 1, 'Days_to_expire': 14}]}
    """
    # NER model for ingrediants

    # Honestly this can change
    return output

@app.post("/RecipeSteps")
async def expire(inputBody: InputModel) -> list:
    input = inputBody.input
    print(input)
    videoGenerator = VideoGenerator(llm=ChatOpenAI(model_name=MODEL_NAME, temperature=TEMPERATURE))
    # Example input
    """
        [
            {
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
            },
            {
                "label" : "Lemon Mint Granita",
                "image_object": {
                    "url": "https://edamam-product-images.s3.amazonaws.com/web-img/01a/01a6be830e22322143c352c559d9ff5f-m.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIEK2cO7xUNAsPHGSRjC9B9bX%2Bc3wdRNFw6xuhDJH%2BAVRAiEAiPglBUHLokqMx6dDMs%2BAJYh74rcGHIl2tDHe6yrp7lkquQUIWxAAGgwxODcwMTcxNTA5ODYiDHtmF0UUx6iIpB76VyqWBYGGh5cT%2BAEo1f%2FmDxc9zzDu2lXnj8z7LC%2BBxxbx3GqeY4As0%2Fc%2Fgdvjdo%2FKLYaGI0qCK7j9LSOfHYWLFm8k%2FAM4aCA1xMcOffyr22QcPeLHsucUABoFkviM8J5QBqEeEH8bkkjswwKL3tp2r259eU%2B23%2Fp7hzr2AhtHMXqV4MbTl7tKFsITxaiJg2RL7t5nLq6%2FJYc3TbAhcZKrXn2VAm7zEu4qGm2%2Bh4o23sDoc6GlcH9NwPrZWfTebtXaAUU5OPBhIV%2BbOMwOBp0taSjtORkFVIBie82qlcDEOizhdUGWSOs3QzW%2BpMa7jIvOrPxiBuFDiOhG79u4BiaIShkEF9N5B%2BHhqL32IN%2BPgk%2BlcHaFs5BJssz60goK2C55HNyYuBz451raYuEewY%2F9g4pZRp2v6EiQ5X%2FSr6FleUaTHybC8Q1lvrMmZ%2BeVqYW41tw6LMf8orHCZZcDE2tuNDIySio2EcMHeDO65jPiziFyXZ96am6xmUBuS%2B7pJ5760KIAqhVIqu0gEW3qyW2pUcMdrarJFsqq2dRVa4Jn%2BR%2F7Kcwn5%2FfiYbFGmrQm4Kkrhq1mjuTRQ1pT%2FhN4r%2F%2Fy4vEOqooPy5Iy4K3pT%2BR7JBfZAxkOBtpSa8FdZL217TDyKgM02CiyZdSaoAo8Z633lgMmOGf2W%2BsO14gSpUwqrqrlsCdCo%2BsQ6AGkwT5Fc84HQ9xFAQTfinUnIYL95hcDKg6mog6ZT9uddMFa%2BXBppJec4XqCHKagXxK7qtvOM4ctfExHvjllRtdgjJO9IZh%2FNNjdJooAxR429HX4plR6rwYY%2BUFkyYwtTC1FbU9F046mm%2FQ0RBuZGpEd0ARAy6qyywcteRsLih%2BcQPlC%2FoFPAvyDRAA0EttCtwYoMK6bp6cGOrEB4yXp95hDYTrlXTMJ4VXA6dauWj%2FlR70GHC77e208iJwfBFfQFcUdRYdQgkUMhlwYS7htdXDtsiXB8%2BRCg5VbJOuAczf5STholpZi5wE4AsQWiGPIW5TasIH1p7qdyxCLo3JiKNpYuN4PUKxwFuDeQDOnhBet5pEeOi3liRXMbY%2BE1kY6%2B1wecbfFB231LLyAtArsfdw7Z5PHwnLRwwoKNGosNg340yLrPxWafNdBKXdH&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230826T101512Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFGLS5FYWR%2F20230826%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=27ac2e875713ce4df66fbf47c59c0f896267c96ff11a06cb1c0e734628464e8a",
                    "width": 200,
                    "height": 200
                },
                "Recipe_steps_url" : "http://smittenkitchen.com/2009/06/lemon-mint-granita/#more-3296",
                "ingredientLines" : [
                    "4 lemons",
                    "4 cups water",
                    "Sugar, to taste (we used 3 tablespoons, like a tart lemonade)",
                    "Handful of fresh mint leaves"
                ],
                "calories" : 162.53788681233374,
                "cuisineType" : "Italian",
                "healthLabels" : [
                    "Low Potassium",
                    "Kidney-Friendly",
                    "Vegan",
                    "Vegetarian",
                    "Pescatarian",
                    "Dairy-Free",
                    "Gluten-Free",
                    "Wheat-Free",
                    "Egg-Free",
                    "Peanut-Free",
                    "Tree-Nut-Free",
                    "Soy-Free",
                    "Fish-Free",
                    "Shellfish-Free",
                    "Pork-Free",
                    "Red-Meat-Free",
                    "Crustacean-Free",
                    "Celery-Free",
                    "Mustard-Free",
                    "Sesame-Free",
                    "Lupine-Free",
                    "Mollusk-Free",
                    "Alcohol-Free",
                    "No oil added",
                    "Kosher"
                ],
                "dishType": "drinks",
                "mealType" : "lunch/dinner"
            }
        ]
    """
    # Example output for LLM
    """
{'list_of_ingrediants': [{'index': 1,
   'label': 'Pasta alla Gricia Recipe',
   'steps': '1. Cook the pasta according to the package instructions.\n2. In a large skillet, cook the guanciale over medium heat until crispy.\n3. Remove the guanciale from the skillet and set aside.\n4. In the same skillet, melt the butter over medium heat.\n5. Add the cooked pasta to the skillet and toss to coat in the butter.\n6. Crumble the crispy guanciale over the pasta.\n7. Serve hot and enjoy!'},
  {'index': 2,
   'label': 'Lemon Mint Granita',
   'steps': '1. Juice the lemons and strain the juice.\n2. In a saucepan, combine the lemon juice, water, and sugar.\n3. Heat the mixture over medium heat until the sugar dissolves.\n4. Remove from heat and let cool.\n5. Pour the mixture into a shallow dish and freeze for 1 hour.\n6. Scrape the mixture with a fork to create icy flakes.\n7. Return to the freezer and repeat the scraping process every 30 minutes until the granita is fully frozen.\n8. Serve in glasses and garnish with fresh mint leaves.\n9. Enjoy!'}]}
    """

    output = videoGenerator.RecipeSteps(input)
    print('output for Recipe Generation: ', output)
    # Add "steps" key to each recipe in input list of dict
    for i,recipe in enumerate(input):
            print(f'added steps to recipe: {recipe["label"]}')
            # Add new "steps" key to output
            recipe["steps"] = output["list_of_ingrediants"][i]["steps"]

    """
    Example Final output, same as input with extra "steps" key
    """
    return input

