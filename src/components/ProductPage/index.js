import React, {Component} from 'react'
import api from '../../services/api';
import {getStringDate, getStringFloat} from '../../rules';
import {SyncLoader} from 'react-spinners'
import {Title, NoConnection, Loader, LinkButton} from '../../styles/styles';
import {Profile} from '../../styles/pageStyles';
import {MdEdit} from 'react-icons/md';

export default class ProductPage extends Component{
    // State
    state = {
        prod: {},
        connection: true,
        loading: true,
    }

    async componentDidMount(){
        const { match: { params } } = this.props;
        try{
            // Get product data
            const prod = await api.get(`/getProductById.php?id=${params.id}`);
            this.setState({loading: false, prod: prod.data});
        } catch (e){
            this.setState({loading: false, connection: false});
        }
    }

    render(){
        const {prod, loading, connection} = this.state;

        return(
            <section>
                {/* While loading  */}
                {loading && (<Loader><SyncLoader/></Loader>)}

                {/* Connection error */}
                {!connection && (<NoConnection/>)}

                {/* If not loading and connected */}
                {(!loading && connection) && (
                    <div>
                        <Title>{prod.name}</Title>

                        {/* Render profile */}
                        <Profile>
                            <figure>
                                <img src={prod.picture} alt={prod.name}></img>
                            </figure>
        
                            <div className="stats">
                                <span>
                                    <strong>Id: </strong>{prod._id}
                                </span>
                                <span>
                                    <strong>Preço: </strong>{getStringFloat(prod.price)}
                                </span>
                                <span>
                                    <strong>Registro: </strong>{getStringDate(prod.createdAt)}
                                </span>
                                <span>
                                    <strong>Múltiplo: </strong>{prod.multiple}
                                </span>

                                <div className="actions">
                                    <LinkButton to={`/products/edit/${prod._id}`} title="Editar"><MdEdit className="TableButton"/></LinkButton>
                                </div>
                            </div>
                        </Profile>
                     </div>
                )}
            </section>
        );
    }
}
