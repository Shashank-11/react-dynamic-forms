import boto3
import pandas as pd
import xlsxwriter
import io
import base64
import zipfile

def lambda_handler(event, context):
    # Get bucket name and file key from event
    bucket_name = event['bucket_name']
    file_key = event['file_key']
    
    # Initialize S3 client
    s3_client = boto3.client('s3')
    
    # Initialize response buffer
    response_buffer = io.BytesIO()
    with zipfile.ZipFile(response_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Download the CSV file from S3 directly to ZIP
        csv_object = s3_client.get_object(Bucket=bucket_name, Key=file_key)
        csv_stream = csv_object['Body']
        
        # Convert CSV to Excel and add to ZIP
        excel_buffer = io.BytesIO()
        df = pd.read_csv(csv_stream)
        with pd.ExcelWriter(excel_buffer, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Sheet1')
        zip_file.writestr('output.xlsx', excel_buffer.getvalue())
    
    # Base64 encode the entire ZIP content
    zip_base64 = base64.b64encode(response_buffer.getvalue()).decode('utf-8')
    
    # Create the response object
    response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=output.zip'
        },
        'body': zip_base64,
        'isBase64Encoded': True
    }
    
    return response
