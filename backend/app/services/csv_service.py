import io
from typing import List, Tuple

import pandas as pd
from fastapi import UploadFile
from pandas.errors import EmptyDataError, ParserError

from ..core.config import ALLOWED_FILE_EXTENSIONS, SAMPLE_ROWS_LIMIT
from ..core.exceptions import ProcessingAPIError, ValidationAPIError


class CSVService:
    """Service for handling CSV file operations."""

    @staticmethod
    def validate_file(file: UploadFile) -> None:
        """
        Validate uploaded file.

        Args:
            file: The uploaded file

        Raises:
            ValidationAPIError: If file is invalid
        """
        if not file.filename or not any(file.filename.endswith(ext) for ext in ALLOWED_FILE_EXTENSIONS):
            raise ValidationAPIError("Only CSV files are allowed")

    @staticmethod
    async def parse_csv(file: UploadFile) -> Tuple[List[str], List[List[str]]]:
        """
        Parse CSV file and extract headers and sample rows.

        Args:
            file: The uploaded CSV file

        Returns:
            Tuple of (headers, sample_rows)

        Raises:
            ValidationAPIError: If file is invalid or empty
            ProcessingAPIError: If parsing fails
        """
        CSVService.validate_file(file)

        try:
            content = await file.read()
            if not content:
                raise ValidationAPIError("Empty file uploaded")

            # Try different encodings
            encodings = ["utf-8", "latin1", "iso-8859-1"]
            df = None
            last_error = None

            for encoding in encodings:
                try:
                    file_obj = io.BytesIO(content)
                    df = pd.read_csv(file_obj, encoding=encoding)
                    break
                except UnicodeDecodeError:
                    last_error = f"Failed to decode with {encoding} encoding"
                    continue
                except Exception as e:
                    last_error = str(e)
                    break

            if df is None:
                raise ValidationAPIError(f"Failed to parse CSV file: {last_error}")

            headers = df.columns.tolist()
            sample_rows = (
                df.head(SAMPLE_ROWS_LIMIT).fillna("").astype(str).values.tolist()
            )

            return headers, sample_rows

        except EmptyDataError:
            raise ValidationAPIError("The CSV file is empty")
        except ParserError:
            raise ValidationAPIError("Invalid CSV format")
        except Exception as e:
            raise ProcessingAPIError(f"Error processing CSV file: {str(e)}")
        finally:
            await file.close()
