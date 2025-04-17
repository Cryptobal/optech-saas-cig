"""rename full_name to nombre and apellido

Revision ID: rename_full_name
Revises: c86052b99346
Create Date: 2024-04-16 23:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'rename_full_name'
down_revision: Union[str, None] = 'c86052b99346'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Renombrar la columna full_name a nombre
    op.alter_column('users', 'full_name', new_column_name='nombre')
    # Agregar la nueva columna apellido
    op.add_column('users', sa.Column('apellido', sa.String(), nullable=True))


def downgrade() -> None:
    # Revertir los cambios
    op.alter_column('users', 'nombre', new_column_name='full_name')
    op.drop_column('users', 'apellido') 