//Products page
import React, {Component} from "react";
import {TableData} from "../../../styles/tableStyles";
import {getStringFloat, getRentability} from '../../../rules';
import api from "../../../services/api";
import { LinkStyled } from "../../../styles/styles";
import {uniqueId} from 'lodash';

class TableContent extends Component {
    state = {
        products: []
    }

    componentDidMount(){
        this.getAllProdNames();
    }

    getAllProdNames = async () => {
        const prodHolder = this.props.products;
        let products = [];
        const promise = await prodHolder.map(async prod => {
            const p = await api.get(`/getProductById.php?id=${prod.productId}`);
            products.push({
                id: p.data._id,
                name: p.data.name,
                price: p.data.price,
                newPrice: prod.price,
                amount: prod.amount,
                rentability: getRentability(p.data.price, prod.price)
            });
        });

        await Promise.all(promise);
        this.setState({products});
    }

    render() {
        const {products} = this.state;

        return (
            <tbody>
                {products.map(prod => {
                    return(
                        <tr key={uniqueId()}>
                            <TableData><LinkStyled to={`/products/${prod.id}`}>{prod.name}</LinkStyled></TableData>
                            <TableData>{getStringFloat(prod.price)}</TableData>
                            <TableData>{getStringFloat(prod.newPrice)}</TableData>
                            <TableData>{prod.amount}</TableData>
                            <TableData style={{color: prod.rentability.color}}>{prod.rentability.rent}</TableData>
                        </tr>
                    )   
                })}
            </tbody>
        );
    }
}

export default TableContent;