from sqlalchemy.schema import CreateTable
from sqlalchemy.dialects import mssql
from app.database import Base
# Import all models to ensure they are registered with Base.metadata
import app.models

def generate_schema_sql():
    """
    Generates a SQL Server (T-SQL) compatible CREATE TABLE script
    from the SQLAlchemy models' metadata.
    """
    # The dialect for SQL Server
    dialect = mssql.dialect()

    sql_statements = []
    for table in Base.metadata.sorted_tables:
        # The CreateTable constructor generates the CREATE TABLE DDL.
        # The compile method with the specified dialect produces the string.
        statement = str(CreateTable(table).compile(dialect=dialect))
        sql_statements.append(f"{statement.strip()};\n\n")

    return "".join(sql_statements)

if __name__ == "__main__":
    print("Generating schema.sql for SQL Server...")
    sql_script = generate_schema_sql()

    # Write the script to a file
    with open("backend/schema.sql", "w") as f:
        f.write("-- Generated SQL schema for SQL Server\n")
        f.write("-- This script is generated from the SQLAlchemy models.\n\n")
        f.write(sql_script)

    print("✅ schema.sql generated successfully in the 'backend' directory.")
