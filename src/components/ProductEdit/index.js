import React, {Component} from 'react';
import api from '../../services/api';
import {Link} from 'react-router-dom';
import {SyncLoader} from 'react-spinners';
import {SendButton, Title, NoConnection, Loader, Missing, Success, FormLabelItem} from '../../styles/styles';


export default class ProductEdit extends Component {
     //State
     state = {
        loading: true,
        connection: true,
        missing: false,
        success: false,
        getting: true,
        prod: {},
    }

    
    async componentDidMount () {
        //Get client data
        const { match: { params } } = this.props;
        try{   
            const prod = await api.get(`/getProductById.php?id=${params.id}`);
            this.setState({prod: prod.data, loading: false, getting: false});    
        } catch{
            this.setState({loading: false, connection: false, getting: false});    
        }
    }

     //Send form to api
     handleSubmit = async e => {
        //Stop form
        e.preventDefault();
        //Reset state
        this.setState({connection: true, missing: false, success: false});

        //Check for empty fields
        if (e.target.name.value === "" || e.target.price.value === "" || e.target.multiple.value === "") {
            this.setState({missing: true, connection: true})
            return;
        }

        // Set loading state
        this.setState({loading: true});

        //Send data to api
        api.post(`/updateProduct.php`, JSON.stringify({
            id: this.state.prod._id,
            name: e.target.name.value,
            price: parseFloat(e.target.price.value),
            multiple: parseInt(e.target.multiple.value),
            picture: e.target.picture.value,
        }))
            .then((res) => {       
                this.setState({success: true, loading: false});
                //Empty fields
                document.getElementById("form").reset(); 
                //Set new data
               this.setState({prod: res.data});
            }, (e) => {
                // Catch
                this.setState({connection: false, loading: false});
            });
    }

    render() {
        const {prod, loading, connection, missing, success, getting} = this.state;

        return (
            <section>
                <Title>Atualizar Cliente</Title>
                {/* Registered */}
                {success && (<Success><Link to={`/products/${prod._id}`} className="link"/></Success>)}

                {/* While loading */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* Connection error */}
                {!connection && (<NoConnection/>)}

                {/* Missing fields */}
                {missing && (<Missing/>)}

                {/* Render form */}
                {(connection && !getting) && (
                    <form onSubmit={this.handleSubmit} id="form">
                    <FormLabelItem>
                        <span>Nome</span>
                        <input type="text" name="name" defaultValue={prod.name} required/>
                    </FormLabelItem>

                    <FormLabelItem>
                        <span>Preço</span>
                        <input type="number" step="0.01" name="price" defaultValue={prod.price} required/>
                    </FormLabelItem>

                    <FormLabelItem>
                        <span>Múltiplo</span>
                        <input type="number" step="1" name="multiple" defaultValue={prod.multiple} required/>
                    </FormLabelItem>
  
                    <FormLabelItem>
                        <span>Imagem (Link)</span>
                        <input type="text" name="picture" defaultValue={prod.picture}/>
                    </FormLabelItem>
                    <SendButton type="submit" value="Atualizar"/>
                  </form>
                )}
            </section>
        );
    }
}
