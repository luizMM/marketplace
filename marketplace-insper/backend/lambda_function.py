"""
Lambda function: processa transações de forma assíncrona.
Invocada pelo backend FastAPI com InvocationType='Event' (fire-and-forget).

Fluxo:
  1. Debita o saldo do comprador no DynamoDB
  2. Credita o saldo do vendedor
  3. Transfere a propriedade do item
  4. Marca a transação como 'concluida'
"""
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('gamevault-users')
items_table = dynamodb.Table('gamevault-items')
transactions_table = dynamodb.Table('gamevault-transactions')


def lambda_handler(event, context):
    transaction_id = event['transaction_id']
    buyer_id = event['buyer_id']
    seller_id = event['seller_id']
    item_id = event['item_id']
    amount = Decimal(str(event['amount']))

    try:
        users_table.update_item(
            Key={'id': buyer_id},
            UpdateExpression='SET balance = balance - :amount',
            ExpressionAttributeValues={':amount': amount},
        )

        users_table.update_item(
            Key={'id': seller_id},
            UpdateExpression='SET balance = balance + :amount',
            ExpressionAttributeValues={':amount': amount},
        )

        items_table.update_item(
            Key={'id': item_id},
            UpdateExpression='SET owner_id = :buyer_id',
            ExpressionAttributeValues={':buyer_id': buyer_id},
        )

        transactions_table.update_item(
            Key={'id': transaction_id},
            UpdateExpression='SET #s = :status',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':status': 'concluida'},
        )

        return {'statusCode': 200, 'body': 'ok'}

    except Exception as e:
        transactions_table.update_item(
            Key={'id': transaction_id},
            UpdateExpression='SET #s = :status',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':status': 'erro'},
        )
        raise e
