"""empty message

Revision ID: d00fc0389002
Revises: d0441292eec0
Create Date: 2020-11-02 18:26:35.229321

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd00fc0389002'
down_revision = 'd0441292eec0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todos', 'list_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todos', 'list_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###
