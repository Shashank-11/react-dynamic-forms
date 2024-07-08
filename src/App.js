import io
import boto3
import json
import pandas as pd
import base64
import datetime
import zipfile
from marketiq.core import S3Helper
from marketiq.api import RequestEventParser
from marketiq.api.lambda_helper import create_response_headers

def api_download_all(event, context):
    try:
        request_event_parser = RequestEventParser(event, context)
        request = request_event_parser.parse()
        s3_client = boto3.client('s3')
        account_id = S3Helper.get_account_id_from_context(context=context)
        env_suffix = S3Helper.ENV_SUFFIX_BY_ACCOUNT_ID[account_id]
        bucket_name = f'jv-{account_id}-lz.mmiq-{env_suffix}'
        csv_file_name = 'cbaiq-mmiq.csv'

        response = s3_client.list_objects_v2(
            Bucket=bucket_name,
            Prefix=f'export/redis_export_{request.brand_list[0]}'
        )

        if 'Contents' not in response or not response['Contents']:
            raise FileNotFoundError("No files found in the specified S3 path.")

        def get_latest_file_by_date(files):
            latest_file = max(files, key=lambda x: datetime.datetime.strptime(x['Key'].split('/')[-2].split('=')[1], '%Y%m%d'))
            return latest_file['Key']

        latest_filename = get_latest_file_by_date(response['Contents'])
        csv_obj = s3_client.get_object(Bucket=bucket_name, Key=latest_filename)
        csv_body = csv_obj['Body'].read()

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.writestr(csv_file_name, csv_body)
        zip_buffer.seek(0)

        headers = {
            "Content-Type": "application/zip",
            "Content-Disposition": f'attachment; filename={csv_file_name}.zip'
        }

        return {
            "statusCode": 200,
            "body": base64.b64encode(zip_buffer.getvalue()).decode("utf-8"),
            "headers": headers
        }

    except FileNotFoundError as fnf_error:
        return {
            "statusCode": 404,
            "body": json.dumps(f"Error: {str(fnf_error)}"),
            "headers": create_response_headers(event=event),
            "errorType": "FileNotFoundError"
        }
    except Exception as error:
        return {
            "statusCode": 500,
            "body": json.dumps(f"Error: Internal server error. {str(error)}"),
            "headers": create_response_headers(event=event),
            "errorType": "UnexpectedError"
        }





import unittest
from unittest.mock import patch, MagicMock
from moto import mock_s3
import boto3
import base64
import json
from your_module import api_download_all  # Replace with your actual module name

class TestAPIDownloadAll(unittest.TestCase):

    @mock_s3
    @patch('your_module.RequestEventParser')
    @patch('your_module.S3Helper')
    def test_api_download_all_success(self, MockS3Helper, MockRequestEventParser):
        # Set up the mocks
        s3_client = boto3.client('s3', region_name='us-east-1')
        s3_client.create_bucket(Bucket='jv-123-lz.mmiq-test')
        s3_client.put_object(Bucket='jv-123-lz.mmiq-test', Key='export/redis_export_brand/20230101/data.csv', Body='data1')
        s3_client.put_object(Bucket='jv-123-lz.mmiq-test', Key='export/redis_export_brand/20240101/data.csv', Body='data2')

        # Mock the request event parser and S3 helper
        MockRequestEventParser.return_value.parse.return_value.brand_list = ['brand']
        MockS3Helper.get_account_id_from_context.return_value = '123'
        MockS3Helper.ENV_SUFFIX_BY_ACCOUNT_ID = {'123': 'test'}

        # Create a fake event and context
        event = {}
        context = {}

        # Call the function
        response = api_download_all(event, context)

        # Assertions
        self.assertEqual(response['statusCode'], 200)
        self.assertIn('Content-Type', response['headers'])
        self.assertEqual(response['headers']['Content-Type'], 'application/zip')
        self.assertIn('body', response)
        zip_content = base64.b64decode(response['body'])
        with zipfile.ZipFile(io.BytesIO(zip_content), 'r') as zip_file:
            with zip_file.open('cbaiq-mmiq.csv') as csv_file:
                self.assertEqual(csv_file.read(), b'data2')

    @patch('your_module.RequestEventParser')
    @patch('your_module.S3Helper')
    def test_api_download_all_failure(self, MockS3Helper, MockRequestEventParser):
        # Mock the request event parser and S3 helper to raise an exception
        MockRequestEventParser.return_value.parse.side_effect = Exception("Test Exception")

        # Create a fake event and context
        event = {}
        context = {}

        # Call the function
        response = api_download_all(event, context)

        # Assertions
        self.assertEqual(response['statusCode'], 500)
        self.assertIn('body', response)
        self.assertIn("Test Exception", response['body'])

if __name__ == '__main__':
    unittest.main()
