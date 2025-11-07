

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para edição de item da lista
  --------------------------------------------------------------------------------------
*/
const insertEditCell = (parent, row) => {
  const ICON_URL = 'img/pen.png';
  let btn = document.createElement('button');
  btn.className = 'editBtn';
  btn.title = 'Editar item';
  let img = document.createElement('img');
  img.src = ICON_URL;
  img.width = 15;
  img.height = 15;
  img.alt = 'editar';
  btn.appendChild(img);
  parent.appendChild(btn);

   btn.onclick = function () {
     // abrir o modal de edição com os valores já preenchidos
     const r = row || this.parentElement.parentElement;
     const oldName = r.getAttribute('data-name') || r.cells[0].textContent;

     const modal = document.getElementById('editModal');
     const inName = document.getElementById('editName');
     const inQty = document.getElementById('editQuantity');
     const inPrice = document.getElementById('editPrice');

     inName.value = r.cells[0].textContent;
     inQty.value = r.cells[1].textContent;
     inPrice.value = r.cells[2].textContent;

     modal.style.display = 'flex';

     // guardar o índice da linha e o nome antigo para uso posterior
     modal.setAttribute('data-row-index', r.rowIndex);
     modal.setAttribute('data-old-name', oldName);
   };
 }

 // botoes do modal
 document.addEventListener('DOMContentLoaded', () => {
   const modal = document.getElementById('editModal');
   const saveBtn = document.getElementById('saveEdit');
   const cancelBtn = document.getElementById('cancelEdit');

   cancelBtn.addEventListener('click', () => {
     modal.style.display = 'none';
     alert('Edição cancelada');
   });

   saveBtn.addEventListener('click', () => {
     const inName = document.getElementById('editName');
     const inQty = document.getElementById('editQuantity');
     const inPrice = document.getElementById('editPrice');

     const rowIndex = modal.getAttribute('data-row-index');
     if (!rowIndex) {
       modal.style.display = 'none';
       return;
     }

     const table = document.getElementById('myTable');
     const r = table.rows[rowIndex];
     const oldName = modal.getAttribute('data-old-name') || r.cells[0].textContent;

     const newName = inName.value.trim();
     const newQty = inQty.value.trim();
     const newPrice = inPrice.value.trim();

     if (newName === '') {
       alert('Nome não pode ser vazio');
       return;
     }

    // atualizar no servidor via PUT /produto
    updateItem(oldName, newName, newQty, newPrice)
      .then((resp) => {
        // assume sucesso
        r.cells[0].textContent = newName;
        r.cells[1].textContent = newQty;
        r.cells[2].textContent = newPrice;
        r.setAttribute('data-name', newName);

        modal.style.display = 'none';
        alert('Alterações salvas!');
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao salvar alterações no servidor');
      });
  });
});


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  row.setAttribute('data-name', nameProduct);

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertEditCell(row.insertCell(-1), row)
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item no servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = async (oldName, newName, newQuantity, newPrice) => {
  const payload = {
    nome_antigo: oldName,
    nome: newName,
    quantidade: isNaN(Number(newQuantity)) ? null : Number(newQuantity),
    valor: Number(newPrice),
  };

  let url = 'http://127.0.0.1:5000/produto';
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
};