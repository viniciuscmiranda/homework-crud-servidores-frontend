import React, {Component} from 'react';
import api from '../../services/api';
import {Link} from 'react-router-dom';
import {SyncLoader} from 'react-spinners';
import {SendButton, Title, NoConnection, Loader, Missing, Success, FormLabelItem} from '../../styles/styles';


export default class ClientEdit extends Component {
     //State
     state = {
        loading: true,
        connection: true,
        missing: false,
        success: false,
        getting: true,
        cli: {},
    }

    
    async componentDidMount () {
        //Get client data
        const { match: { params } } = this.props;
        try{   
            const cli = await api.get(`/getClientById.php?id=${params.id}`);
            this.setState({cli: cli.data, loading: false, getting: false});    
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
        if (e.target.name.value === "") {
            this.setState({missing: true, connection: true});
            return;
        }

        // Set loading state
        this.setState({loading: true});

        //Send data to api
        api.post(`/updateClient.php`, JSON.stringify({id: this.state.cli._id,name: e.target.name.value, picture: e.target.picture.value}))
            .then((res) => {       
                this.setState({success: true, loading: false});
                //Empty fields
                document.getElementById("form").reset(); 
                //Set new data
               this.setState({cli: res.data});
               console.log(res);
               
            }, (e) => {
                // Catch
                this.setState({connection: false, loading: false});
            });
    }

    render() {
        const {cli, loading, connection, missing, success, getting} = this.state;

        return (
            <section>
                <Title>Atualizar Cliente</Title>
                {/* Registered */}
                {success && (<Success><Link to={`/clients/${cli._id}`} className="link"/></Success>)}

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
                          <input type="text" name="name" defaultValue={cli.name} required/>
                      </FormLabelItem>
  
                      <FormLabelItem>
                          <span>Imagem (Link)</span>
                          <input type="text" name="picture" defaultValue={cli.picture}/>
                      </FormLabelItem>
                      <SendButton type="submit" value="Atualizar"/>
                  </form>
                )}
            </section>
        );
    }
}
