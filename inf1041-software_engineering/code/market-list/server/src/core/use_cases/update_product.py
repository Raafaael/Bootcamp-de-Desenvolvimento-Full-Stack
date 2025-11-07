from typing import Optional

from src.core.entities.product import Product
from src.core.exceptions import ProductNotFound
from src.core.interfaces.product_repository import ProductRepository
from src.core.interfaces.usecase_interface import UseCase


class UpdateProductUseCase(UseCase):
    """Use case to update an existing product identified by its old name."""

    def __init__(self, repository: ProductRepository):
        self._repository = repository

    def execute(self, old_name: str, nome: str, quantidade: Optional[int], valor: float) -> Product:
        product = Product(nome=nome, quantidade=quantidade, valor=valor)
        updated = self._repository.update_by_name(old_name, product)
        if not updated:
            raise ProductNotFound(f"Produto '{old_name}' não encontrado.")
        return updated
