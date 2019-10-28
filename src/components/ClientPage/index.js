import React, {Component} from 'react'
import api from '../../services/api';
import {getStringDate} from '../../rules';
import {SyncLoader} from 'react-spinners'
import {Title, NoConnection, Loader, LinkButton} from '../../styles/styles';
import {MdEdit} from 'react-icons/md';

import {Profile} from '../../styles/pageStyles';


export default class ClientPage extends Component{
    // State
    state = {
        cli: {},
        connection: true,
        loading: true,
    }

    async componentDidMount(){
        const { match: { params } } = this.props;
        try{
            // Get client data
            const cli = await api.get(`/getClientById.php?id=${params.id}`);
            this.setState({loading: false, cli: cli.data});
        } catch (e){
            this.setState({loading: false, connection: false});
        }
    }

    render(){
        const {cli, loading, connection} = this.state;

        return(
            <section>
                {/* While loading  */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* Connection error */}
                {!connection && (<NoConnection/>)}

                {/* If not loading and connected */}
                {(!loading && connection) && (
                    <div>
                        <Title>{cli.name}</Title>

                        {/* Render profile */}
                        <Profile>
                            <figure>
                                <img src={cli.picture} alt={cli.name}></img>
                            </figure>
        
                            <div className="stats">
                                <span>
                                    <strong>Id: </strong>{cli._id}
                                </span>
                                <span>
                                    <strong>Registro: </strong>{getStringDate(cli.createdAt)}
                                </span>
                                
                                <div className="actions">
                                    <LinkButton to={`/clients/edit/${cli._id}`} title="Editar"><MdEdit className="TableButton"/></LinkButton>
                                </div>
                            </div>
                        </Profile>
                     </div>
                )}
            </section>
        );
    }
}
