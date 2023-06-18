import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from "react";
import './App.css';

const GET_ALL_BOOKS = gql`
  query GetBooks {
    getBooks {
      id
      title
      description
      image
      price
      author {
        name
      }
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      created_at
    }
  }
`;

const CREATE_BOOK = gql`
  mutation Mutation($data: CreateBookInput!) {
    createBook(data: $data) {
      title
      price
      id
      description
      created_at
    }
  }
`;

const EDIT_BOOK = gql`
  mutation Mutation($data: EditBookInput!) {
    editBook(data: $data) {
      title
      price
      id
      description
      created_at
    }
  }
`;

const DELETE_BOOK = gql`
  mutation Mutation($id: String!) {
    deleteBook(id: $id)
  }
`;

const CREATE_USER = gql`
  mutation Mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      name
      email
      id
      created_at
    }
  }
`;

function DisplayBooks({ onOrdered }) {
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries : [GET_ALL_BOOKS]
  });
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries : [GET_ALL_BOOKS]
  });
  const [editBook] = useMutation(EDIT_BOOK, {
    refetchQueries : [GET_ALL_BOOKS]
  });
  const { data, error, loading } = useQuery(GET_ALL_BOOKS);
  const users = useQuery(GET_ALL_USERS);
  const [formData, setFormData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isEditing, setIsEditing] = useState({ id: null, title: null, price: null, description: null });

  const handleSubmit = async (event) => {
    event.preventDefault();
    addBook({ variables: { data: formData } });
    document.getElementById("books-form").reset();
    setFormData({});
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? parseInt(value) : value,
    }));
  }
  
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setIsEditing((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? parseInt(value) : value,
    }));
  }
  
  const handleDeleteBook = async (bookId) => {
    if (!bookId) return;
    await deleteBook({ variables: { id: bookId } });
  }

  const resetEdit = () => {
    setIsEditing({ id: null, title: null, price: null, description: null });
  }

  const handleEditBook = async (data) => {
    if (!data || !data.id) return;
    resetEdit();
    await editBook({ variables: { data: data } });
  }
  
  if (error) return `Submission error! ${error.message}`;

  const Books = loading ? 'Carregando...' : data.getBooks.map(({ id, title, description, price, author, image }) => (
    <div className='bookContainer' key={ id }>
      <div className='relative'>
        <div className='buy' onClick={() => onOrdered({ id: id, title: title, price: price })}><span>Comprar 🛒</span></div>
        <img width="250" alt="location-reference" src={`${ image }`} />
      </div>
      { isEditing.id === id ? 
        <>
          <b>Título:</b>
          <input name='title' value={isEditing.title} onChange={handleEditChange}/> 
        </> : 
        <h3>{ title }</h3>
      }
      
      <b>Descrição do livro:</b>
      { isEditing.id === id ? 
        <textarea name='description' value={isEditing.description} onChange={handleEditChange}/> : 
        <p>{ description }</p> 
      }
      <br />

      <b>Preço do livro:</b>
      { isEditing.id === id ? 
        <input name='price' type='number' value={isEditing.price} onChange={handleEditChange}/> :  
        <p>R$ { price },00</p>
      }
      <br />

      <b>Autor:</b>
      <p>{ author.name }</p>
      <hr/>
      {((!confirmDelete || confirmDelete !== id) && isEditing.id !== id) && <>
        <button className='delete' onClick={() => setConfirmDelete(id)}>Deletar</button>
        <button className='edit' onClick={() => setIsEditing({ id: id, title: title, price: price, description: description })}>Editar</button></>
      }
      {confirmDelete && confirmDelete === id && <>
        <p><b>Deseja realmente excluir?</b></p>
        <button className='delete' onClick={() => handleDeleteBook(confirmDelete)}>SIM</button>
        <button className='edit' onClick={() => setConfirmDelete(null)}>NÃO</button></>
      }
      {isEditing && isEditing.id === id && <>
        <button className='delete' onClick={() => handleEditBook(isEditing)}>Salvar</button>
        <button className='edit' onClick={() => resetEdit()}>Cancelar</button></>
      }
    </div>
  ));

  return (
    <>
      <form id='books-form' onSubmit={ (event) => handleSubmit(event)}>
        <h3>Cadastrar Livro 📚</h3>
        <input name='title' onChange={handleInputChange} placeholder='Nome do livro' required/>
        <textarea name='description' onChange={handleInputChange} placeholder='Descrição do livro' required/>
        <input type='number' name='price' onChange={handleInputChange} placeholder='Preço do livro' required/>
        <input name='image' onChange={handleInputChange} placeholder='URL da imagem' required/>
        <select name="author_id" onChange={handleInputChange} required>
          <option selected value="">Selecione o Autor</option>
          { users.data.getUsers.map((element, index) => <option key={index} value={element.id}>{element.name}</option>) }
        </select>
        <button type='submit'>Salvar</button>
      </form>

      <h2>Livros</h2>
      <div className='data-list'>
        { Books.length === 0 ? 'Nenhum livro cadastrado 😭' : Books }
      </div>
    </>
  );
}

function DisplayUsers() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [addUser] = useMutation(CREATE_USER, {
    refetchQueries : [GET_ALL_USERS]
  });
  const [formData, setFormData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    addUser({ variables: { data: formData } });
    setFormData({});
    document.getElementById("users-form").reset();
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  if (error) return `Submission error! ${error.message}`;
  
  const Users = loading ? 'Carregando...' : data.getUsers.map(({ id, name, email, created_at }) => (
    <div className='bookContainer' key={ id }>
      <h3>{ name }</h3>
      <br />
      <b>E-mail:</b>
      <p>{ email }</p>
      <br />
      <b>Criado:</b>
      <p>
        {
          new Date(created_at).getDate() }/{ 
          new Date(created_at).getMonth() < 10 ? '0' + new Date(created_at).getMonth() : new Date(created_at).getMonth()}/{ 
          new Date(created_at).getFullYear() 
        }
      </p>
    </div>
  ));

  return (
    <>
      <form id='users-form' onSubmit={ (event) => handleSubmit(event)}>
        <h3>Cadastrar Autor 👤</h3>
        <input name='name' onChange={handleInputChange} placeholder='Nome do autor' required/>
        <input type='email' name='email' onChange={handleInputChange} placeholder='E-mail do autor' required/>
        <input type='password' name='password' onChange={handleInputChange} placeholder='Senha do autor' required/>
        <button type='submit'>Salvar</button>
      </form>

      <h2>Autores</h2>
      <div className='data-list'>
        { Users.length === 0 ? 'Nenhum autor cadastrado 😭' : Users }
      </div>
    </>
  );
}

export default function App() {
  const [showUserTab, setShowUserTab] = useState(true);
  const [showBookTab, setShowBookTab] = useState(false);
  const [orders, setOrders] = useState([]);
  function openNav() {
    document.getElementById("orderNav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("orderNav").style.width = "0";
  }

  function removeOrder(orderId) {
    if (!orderId) return;
    const updatedItems = orders.filter((order) => order.id !== orderId);
    setOrders(updatedItems);
  }

  function handleOrders(data) {
    const orderExist = orders.find(order => order.id === data.id);
    
    openNav();
    if (orderExist) return;
    setOrders([ ...orders, data ]);
  }

  return (
    <div className='main'>
      <h2>Minha biblioteca GraphQL 🚀</h2>
      <button type='button' onClick={() => { setShowUserTab(true); setShowBookTab(false) }}>Autores</button>
      <button type='button' onClick={() => { setShowUserTab(false); setShowBookTab(true) }}>Livros</button>
      <button type='button' className='relative' onClick={ () => openNav() }>Meus pedidos</button>
      <div className='order-nav' id='orderNav'>
        <div className="closeBtn" onClick={ ()=> closeNav() }>&times;</div>
        <div>
          { orders.length < 1 && <span>Nenhum pedido...</span>}
          { orders.length > 0 && <div>{ orders.map(({ id, price, title }) => (
            <div className='flex order-content'>
              <span>{ title }</span>
              <span>R${ price },00 <span className='delete-order' onClick={() => removeOrder(id) }>🗑</span></span>
            </div>
          ))}</div>}
        </div>
        
        <div><b>Total:</b> R$ { orders.reduce((a, b) => +a + +b.price, 0) },00</div>
      </div>
      
      <br/>
      {showUserTab &&
        <DisplayUsers />
      }
      {showBookTab &&
        <DisplayBooks onOrdered={(data) => handleOrders(data)}/>
      }
    </div>
  );
}
