from setuptools import setup, find_packages

setup(
    name="gard-saas",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.105.0",
        "uvicorn>=0.24.0",
        "sqlalchemy>=2.0.0",
        "alembic>=1.12.1",
        "pydantic>=2.4.2",
        "pydantic-settings>=2.0.3",
        "python-multipart>=0.0.6",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "python-dotenv>=1.0.0",
        "psycopg2-binary>=2.9.9",
        "email-validator>=2.1.0"
    ],
) 