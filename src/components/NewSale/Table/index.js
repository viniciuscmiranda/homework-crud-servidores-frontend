import React, {Component} from 'react';
import {TableData, TableHeader} from '../../../styles/tableStyles';
import {TableContainer} from './styles';
import {MdDelete} from 'react-icons/md';
import {ButtonDelete} from '../../../styles/styles';
import { getRentability } from '../../../rules';

export default class Table extends Component {
    getPrice = (price) => {
        return "$" + price
            .toFixed(2)
            .toString()
            .replace('.', ',');
    }

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
            <TableContainer>
                <thead>
                    {!!Object
                        .keys(cart)
                        .length && (
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
                            <tr key={prod._id} id={prod._id}>
                                <TableData>{prod.name}</TableData>
                                <TableData>{this.getPrice(prod.price)}</TableData>
                                <TableData><input
                                    className="prodPrice"
                                    id={`${prod._id}-price`}
                                    defaultValue={prod
                                .price
                                .toFixed(2)}
                                    onChange={(e) => {
                                this.setRentabiliy(prod.price, prod._id);
                                setTotalPrice();
                            }}
                                    min="0.01"
                                    type="number"
                                    step="0.01"/></TableData>
                                <TableData>
                                    <strong>
                                        <span id={`${prod._id}-rent`} style={{color: getRentability(1,1).color}}>{getRentability(1,1).rent}</span>
                                    </strong>
                                </TableData>
                                <TableData><input
                                    type="number"
                                    min={prod.multiple}
                                    defaultValue={prod.multiple}
                                    step={prod.multiple}
                                    className="prodAmount"
                                    onChange={() => setTotalPrice()}/></TableData>
                                <TableData>
                                    <ButtonDelete type="button" onClick={() => onDelete(prod._id)}><MdDelete/></ButtonDelete>
                                </TableData>
                            </tr>
                        )

                    })}

                </tbody>

            </TableContainer>
        );
    }
}
