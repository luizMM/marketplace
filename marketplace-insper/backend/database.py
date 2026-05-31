import boto3
import os
from dotenv import load_dotenv

load_dotenv()

REGION = os.getenv("AWS_REGION", "us-east-1")

dynamodb = boto3.resource('dynamodb', region_name=REGION)

users_table = dynamodb.Table('gamevault-users')
items_table = dynamodb.Table('gamevault-items')
transactions_table = dynamodb.Table('gamevault-transactions')
