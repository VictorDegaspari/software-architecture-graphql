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
function DisplayBooks() {
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries : [GET_ALL_BOOKS]
  });
  const { data, error, loading } = useQuery(GET_ALL_BOOKS);
  const users = useQuery(GET_ALL_USERS);
  console.log(users.data)
  const [formData, setFormData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    addBook({ variables: { data: formData } });
    document.getElementById("books-form").reset();
    setFormData({});
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name)
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? parseInt(value) : value,
    }));
  }
  
  if (error) return `Submission error! ${error.message}`;

  const Books = loading ? 'Carregando...' : data.getBooks.map(({ id, title, description, price, author, image }) => (
    <div className='bookContainer' key={ id }>
    <img width="250" alt="location-reference" src={`${ image }`} />
    <h3>{ title }</h3>
    <b>Descrição do livro:</b>
    <p>{ description }</p>
    <br />
    <b>Preço do livro:</b>
    <p>R$ { price },00</p>
    <br />
    <b>Autor:</b>
    <p>{ author.name }</p>
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
      <b>ID:</b>
      <p>{ id }</p>
      <br />
      <b>E-mail:</b>
      <p>{ email }</p>
      <br />
      <b>Criado:</b>
      <p>{ created_at }</p>
    </div>
  ));

  return (
    <>
      <form id='users-form' onSubmit={ (event) => handleSubmit(event)}>
        <h3>Cadastrar Usuário 👤</h3>
        <input name='name' onChange={handleInputChange} placeholder='Nome do usuário' required/>
        <input type='email' name='email' onChange={handleInputChange} placeholder='E-mail do usuário' required/>
        <input type='password' name='password' onChange={handleInputChange} placeholder='Senha do usuário' required/>
        <button type='submit'>Salvar</button>
      </form>

      <h2>Usuários</h2>
      <div className='data-list'>
        { Users.length === 0 ? 'Nenhum usuário cadastrado 😭' : Users }
      </div>
    </>
  );
}

export default function App() {
  const [showUserTab, setShowUserTab] = useState(true);
  const [showBookTab, setShowBookTab] = useState(false);

  return (
    <div className='main'>
      <h2>Minha biblioteca GraphQL 🚀</h2>
      <button type='button' onClick={() => { setShowUserTab(true); setShowBookTab(false) }}>Adicionar Usuário</button>
      <button type='button' onClick={() => { setShowUserTab(false); setShowBookTab(true) }}>Adicionar Livro</button>

      <br/>
      {showUserTab &&
        <DisplayUsers />
      }
      {showBookTab &&
        <DisplayBooks />
      }
    </div>
  );
}
