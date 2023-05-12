
import {useEffect, useState} from 'react';
import './App.css';
import Formulario from './Produtos/formulario';
import Tabela from './Produtos/tabela';
import produto from './Produtos/Model/produtosModel';


function App() {



//Use state
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setobjProduto] = useState(produto);

//UseEffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())
    .then(data => setProdutos(data));
  }, []);

  //Obtendo os dados do formulário
  const aoDigitar =(e)=>{
    setobjProduto({...objProduto, [e.target.name]:e.target.value});
  }

  //Cadastrar produtos
  const cadastrar = ()=>{
    fetch("http://localhost:8080/cadastrar", {
      method: "POST",
      body: JSON.stringify(objProduto),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(retorno => retorno.json())
    .then(data => { 

        if(data.mensagem !== undefined) {
          alert(data.mensagem)
        }else{
          setProdutos([...produtos, data]);
          alert("produto cadastrado com sucesso!!!");
          limparFormulario();
        }

    });
  }

  //Limpar formulário

  const limparFormulario = ()=>{
    setobjProduto(produto);
    setBtnCadastrar(true);
  }

  //Selecionar produto
  const selecionarProduto = (indice) => {
    setobjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  //Remover produto
  const remover = ()=>{
    fetch("http://localhost:8080/remover/" + objProduto.codigo, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(retorno => retorno.json())
    .then(data => {
      alert(data.mensagem);

      let vetorTemporario = [...produtos];

      let indice = vetorTemporario.findIndex((p)=>{
        return p.codigo === objProduto.codigo;
      });

      vetorTemporario.splice(indice, 1);

      setProdutos(vetorTemporario);

      limparFormulario();
   });
  }

  
  //Alterar produtos
  const alterar = ()=>{
    fetch("http://localhost:8080/alterar", {
      method: "PUT",
      body: JSON.stringify(objProduto),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(retorno => retorno.json())
    .then(data => {

        if(data.mensagem !== undefined) {
          alert(data.mensagem)
        }else{
          alert("produto alterado com sucesso!!!");

          let vetorTemporario = [...produtos];

           let indice = vetorTemporario.findIndex((p)=>{
          return p.codigo === objProduto.codigo;
          });

          vetorTemporario[indice] = objProduto;

          setProdutos(vetorTemporario);
          
          limparFormulario();
        }

    });
  }


//Retorno
  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar}
       obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar}/>
      <Tabela vetor={produtos} selecionar={selecionarProduto}/>
    </div>
  );
}

export default App;
