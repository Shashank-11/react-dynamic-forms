import io
import unittest
from unittest.mock import patch

class TestApiDownloadAll(unittest.TestCase):

  @patch.object(boto3.client, 'list_objects_v2')
  @patch.object(boto3.client, 'get_object')
  def test_successful_download(self, mock_get_object, mock_list_objects):
    # Mock S3 responses
    mock_list_objects.return_value = {
      'Contents': [
        {'Key': 'export/redis_export_brand1=20240708'}
      ]
    }
    mock_get_object.return_value = MagicMock()
    mock_get_object.return_value.Body = io.BytesIO(b"CSV data")

    # Mock event and context objects (replace with your actual data)
    event = {'brand_list': ['brand1']}
    context = MagicMock()

    # Call the function
    response = api_download_all(event, context)

    # Assert response status code and headers
    self.assertEqual(response['statusCode'], 200)
    self.assertIn("Content-Type", response['headers'])
    self.assertEqual(response['headers']['Content-Type'], "application/zip")
    self.assertIn("Content-Disposition", response['headers'])
    self.assertTrue(response['headers']['Content-Disposition'].startswith('attachment; filename=cbaiq-mmiq.csv.zip'))

    # Assert body is base64 encoded zip file
    self.assertIsInstance(response['body'], str)
    decoded_body = base64.b64decode(response['body'])
    with zipfile.ZipFile(io.BytesIO(decoded_body), 'r') as zip_file:
      self.assertEqual(zip_file.namelist(), ['cbaiq-mmiq.csv'])
