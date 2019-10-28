import React, {Component} from 'react';
import {TableData, TableHeader} from '../../../styles/tableStyles';
import {TableContainer} from '../../SaleNew/Table/styles';
import {MdDelete} from 'react-icons/md';
import {ButtonDelete} from '../../../styles/styles';
import { getRentability, getStringFloat } from '../../../rules';
import {uniqueId} from 'lodash';

export default class Table extends Component {
    // Set rentability for each item
    setRentabiliy = (originalPrice, id) => {
        const rentInput = document.getElementById(`${id}-rent`);
        const newPrice = document.getElementById(`${id}-price`).value;

        const rentabiliy = getRentability(originalPrice, newPrice);
        rentInput.innerHTML = rentabiliy.rent;
        rentInput.style.color = rentabiliy.color;
    }

    render() {
        const {cart, onDelete, setTotalPrice} = this.props;

        return (
            // Table 
            <TableContainer>
                <table>
                    <thead>
                        {/* If there's items in the cart */}
                        {!!Object.keys(cart).length && (
                            <tr>
                                <TableHeader>Nome</TableHeader>
                                <TableHeader>Sugerido</TableHeader>
                                <TableHeader>Preço</TableHeader>
                                <TableHeader>Rentabilidade</TableHeader>
                                <TableHeader>Quantidade</TableHeader>
                                <TableHeader>Ações</TableHeader>
                            </tr>
                        )}
                    </thead>

                    <tbody>
                        {cart.map((prod) => {
                            
                            return (
                                <tr key={uniqueId()} id={prod.id}>
                                    <TableData>{prod.name}</TableData>
                                    <TableData>{getStringFloat(prod.price)}</TableData>
                                    <TableData>
                                        {/* Custom price input */}
                                        <input 
                                        className="prodPrice"
                                        id={`${prod.id}-price`}
                                        defaultValue={parseFloat(prod.newPrice).toFixed(2)}
                                        onChange={(e) => {
                                            this.setRentabiliy(prod.price, prod.id);
                                            setTotalPrice();
                                        }}
                                        min="0.01"
                                        type="number"
                                        step="0.01"/>
                                    </TableData>

                                    <TableData>
                                        {/* Rentability */}
                                        <strong>
                                            <span 
                                            id={`${prod.id}-rent`}
                                            style={{color: prod.rentability.color}}>
                                                {prod.rentability.rent}
                                               
                                            </span>
                                        </strong>
                                    </TableData>

                                    <TableData>
                                        {/* Amount input */}
                                        <input
                                        type="number"
                                        min={prod.multiple}
                                        defaultValue={prod.amount}
                                        step={prod.multiple}
                                        className="prodAmount"
                                        onChange={() => setTotalPrice()}/>
                                    </TableData>
                                    
                                    <TableData>
                                        {/* Delete button */}
                                        <ButtonDelete 
                                        type="button"
                                        onClick={() => onDelete(prod.id)}>
                                            <MdDelete/>
                                        </ButtonDelete>
                                    </TableData>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </TableContainer>
        );
    }
}
