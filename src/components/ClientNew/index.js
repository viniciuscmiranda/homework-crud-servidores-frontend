import React, {Component} from 'react';
import api from '../../services/api';
import {SyncLoader} from 'react-spinners'
import {Link} from 'react-router-dom'
import {SendButton, Title, NoConnection, Loader, Missing, Success, FormLabelItem} from '../../styles/styles';


export default class ClientNew extends Component {
    //State
    state = {
        loading: false,
        connection: true,
        missing: false,
        success: false,
        id: "",
    }

    //Send form to api
    handleSubmit = async e => {
        //Stop form
        e.preventDefault();
        //Reset state
        this.setState({connection: true, missing: false, success: false});

        //Check for empty fields
        if (e.target.name.value === "") {
            this.setState({missing: true, connection: true});
            return;
        }

        // Set loading state
        this.setState({loading: true});


        //Send data to api
        api.post('/createClient.php', JSON.stringify({name: e.target.name.value, picture: e.target.picture.value}))
            .then((e) => {       
                console.log(e);
                
                this.setState({success: true, loading: false, id: e.data._id});
                // Empty fields
                document.getElementById("form").reset(); 
            }, (e) => {
                // Catch
                
                this.setState({connection: false, loading: false});
            });
    }

    render() {
        const {success, loading, connection, missing} = this.state;

        return (
            <section>
                <Title>Novo Cliente</Title>
                {/* Registered */}
                {success && (<Success><Link to={`/clients/${this.state.id}`} className="link"/></Success>)}

                {/* While loading */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* Connection error */}
                {!connection && (<NoConnection/>)}

                {/* Missing fields */}
                {missing && (<Missing/>)}

                {/* Render form */}
                <form onSubmit={this.handleSubmit} id="form">
                    <FormLabelItem>
                        <span>Nome</span>
                        <input type="text" name="name" required/>
                    </FormLabelItem>

                    <FormLabelItem>
                        <span>Imagem (Link)</span>
                        <input type="text" name="picture"/>
                    </FormLabelItem>
                    <SendButton type="submit" value="Cadastrar"/>
                </form>
            </section>
        );
    }
}
