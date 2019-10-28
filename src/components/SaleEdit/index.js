import React, {Component} from 'react';
import api from '../../services/api';
import {getRentability} from '../../rules';
import {Link} from 'react-router-dom';
import Table from './Table';
import {MdAddCircleOutline as AddButton} from 'react-icons/md';
import {SyncLoader} from 'react-spinners'
import {SendButton, Title, NoConnection, Loader, Success, CustomError} from '../../styles/styles';
import {LabelItem, StatsHolder, NoSales} from './styles';

export default class NewSale extends Component {
    //Component state
    state = {
        id: "",
        clients: [],
        products: [],
        cart: [],
        clientId: "",
        connection: true,
        loading: true,
        success: false,
        lowrent: false,
        ready: false
    }

    //Get clients and products from api
    async componentDidMount() {
        const { match: { params } } = this.props;

        try {
            let saleHolder = await api.get(`/getSaleById.php?id=${params.id}`);
            const clients = await api.get('/getClients.php');
            const productsData = await api.get('/getProducts.php');

            let cart = [];
            saleHolder = saleHolder.data;

            saleHolder.products.map(async prod => {    
                const refProd = productsData.data.find(p => {return p._id === prod.productId});
                
                let newProduct
                if(refProd===undefined) {
                    newProduct = {
                        id: prod.productId,
                        name: "",
                        price: "",
                        newPrice: prod.price,
                        rentability: getRentability("0.0", prod.price),
                        amount: prod.amount,
                        multiple: ""
                    };
                } else {
                    newProduct = {
                        id: prod.productId,
                        name: refProd.name,
                        price: refProd.price,
                        newPrice: prod.price,
                        rentability: getRentability(refProd.price, prod.price),
                        amount: prod.amount,
                        multiple: refProd.multiple
                    };
                    
                }
                
                cart.push(newProduct);
            });

            
            
            let products = [];
            await productsData.data.map(prod => {
                let newProduct = {
                    id: prod._id,
                    name: prod.name,
                    price: prod.price,
                    newPrice: prod.price,
                    rentability: getRentability(1,1),
                    amount: prod.multiple,
                    multiple: prod.multiple
                };
                
                products.push(newProduct);
                return true;
            });                     

            this.setState({
                id: params.id,
                clientId: saleHolder.clientId,
                clients: clients.data,
                products,
                loading: false,
                cart,
                ready: true
            });
            
            if (!this.state.clients.length || !this.state.products.length) this.setState({connection: false});
            else this.calcTotalPrice();
        }
        catch(e) {
            this.setState({connection: false, loading: false});
            console.log(e);
            
        }
    }

    //Add new product to the cart
    handleAddToCart = async() => {
        //Get selected product
        let selected = document.getElementById("selected-prod").value;
       // selected = selected.querySelectorAll("option")[selected.selectedIndex].value;

        //Check if product's already in the cart
        const prodIsInCart = await this.state.cart.find((p) => { return p.id === selected; });

        if(!prodIsInCart) {
            //If it isn't, then add it
            const prod = this.state.products.find((p) => { return p.id === selected; });
            
            this.setState(previousState => ({ cart: [...previousState.cart, prod ] }));
        } else {
            //If it is, then sum to the amount
            const holder = document.getElementById(selected).querySelector('.prodAmount');
            holder.value = parseInt(holder.value) + parseInt(holder.getAttribute('step'));
        }

        //Recalculate total price
        this.calcTotalPrice();
    }
    
    //Calculate total price
    calcTotalPrice = () => {
        //Get all product's prices and amounts
        const amountHolder = document.querySelectorAll('.prodAmount');
        const priceHolder = document.querySelectorAll('.prodPrice');

        //Set Total Price
        let newPrice = 0;
        //Set Original Price
        let originalPrice = 0;

        //Sum all prices
        amountHolder.forEach((amountItem, index) => {
            //Get product with the same index, then sum
            newPrice += amountItem.value * priceHolder[index].value;
            //Find original price for this product
            let prodPrice = this.state.cart.find(p => {
                
                return p.id === amountItem.parentElement.parentElement.id;

            });

            //Set original price multiplied by amount
            if(prodPrice!==undefined) originalPrice += prodPrice.price * amountItem.value;
        });

        //Set total price input, and apply mask
        document.getElementById("total-price").value = 
        "$" + parseFloat(newPrice).toFixed(2).toString().replace('.', ',');
        //Set original price iput, and apply mask
        document.getElementById("diff-price").value =
         "$" + parseFloat(originalPrice).toFixed(2).toString().replace('.', ',');

        //Get rentability input 
        const rentInput = document.getElementById('rent-price');
        //Get new rentability
        const rentability = getRentability(originalPrice, newPrice);
        //Set rentability input value and color
        rentInput.value = rentability.rent;
        rentInput.style.color = rentability.color;
    };

     //Remove product from the cart
     handleDelete = async(id) => {
        this.setState({
            cart: this.state.cart.filter(function (prod) {
                    let keep = prod.id !== id
                    if (!keep) {
                        //Set Total Price
                        let amountHolder = parseInt(document.getElementById(id).querySelector('.prodAmount').value);
                        let priceHolder = parseFloat(document.getElementById(id).querySelector('.prodPrice').value);
                        let totalPriceHolder = document.getElementById('total-price');
                        let oldPrice = parseFloat(totalPriceHolder.value.split('$')[1].replace(',', '.'));
                        let newPriceHolder = oldPrice - (priceHolder * amountHolder).toFixed(2);
                        let newPrice = "$" + newPriceHolder.toFixed(2).toString().replace(".", ",");
                        totalPriceHolder.value = newPrice;

                        //Set Suggested Price
                        let sugPriceHolder = document.getElementById("diff-price");
                        let oldSugPrice = parseFloat(sugPriceHolder.value.split('$')[1].replace(',', '.'));
                        let newSugPriceHolder = oldSugPrice - (prod.price * amountHolder).toFixed(2);
                        let newSugPrice = "$" + newSugPriceHolder.toFixed(2).toString().replace(".", ",");
                        sugPriceHolder.value = newSugPrice;

                        //Set Rentability
                        const rentInput = document.getElementById('rent-price');
                        const rentability = getRentability(newSugPriceHolder, newPriceHolder);
                        rentInput.value = rentability.rent;
                        rentInput.style.color = rentability.color;
                    }

                    return keep;
                })
        });
    }

    //Send form to server
    handleSubmit = async e => {
        //Cancel form
        e.preventDefault();

        //Reset state
        this.setState({loading: true, lowrent: false, success: false, connection: true});

        //Get data from form
        const clientId = e.target.client.value;
        let products = [];

        let loop = true;
        //Get data from table
        this.state.cart.map(p => {
                //Break if founds low rentability item
                if(!loop) return false;

                //Price from table
                let priceHolder = parseFloat(document.getElementById(p.id).querySelector('.prodPrice').value);
                //Amount from table
                let amountHolder = parseInt(document.getElementById(p.id).querySelector('.prodAmount').value);

                let prod = {};

                //Setting attributes
                prod["productId"] = p.id;
                prod["price"] = priceHolder;
                prod["amount"] = amountHolder;

                //Check rentability
                loop = ((getRentability(p.price, prod.price).rent !== getRentability(1,0).rent));

                //Pushing to products object
                products.push(prod);
                return true;
            });

        if(!loop){
            //Stop loading
            this.setState({loading: false, lowrent: true});
            return;
        }

        //Submit data
        try {
            //Make request
            await api.post(`/updateSale.php`, JSON.stringify({id: this.state.id, clientId, products}));
            this.setState({success: true});
        } catch (e) {
            //Show error message
            this.setState({connection: false});
        } finally {
            //Stop loading
            this.setState({loading: false});
        }
    }

    render() {
        const {
            id,
            success,
            clients,
            products,
            cart,
            loading,
            connection,
            lowrent,
            ready,
            clientId
        } = this.state;

        return (
            <section>
                <Title>Atualizar Venda</Title>

                {/* Connection Error */}
                {!connection && (<NoConnection/>)}

                {/* While Loading */}
                {loading && ( <Loader><SyncLoader/></Loader>)}

                {/* Request success */}
                {(connection && success) && (
                    <Success><Link to={`/sales/${id}`} className="link"/></Success>
                )}

                {/* Low rentaibility found */}
                {lowrent && (<CustomError><span>Um ou mais produtos com baixa rentabilidade!</span></CustomError>)}

                {/* If could get data from database */}
                {(connection && !!products.length && !!clients.length && ready && (
                    <form onSubmit={this.handleSubmit}>
                        <LabelItem>
                            <span>Cliente</span>
                            {/* Set clients */}
                            <select name="client" defaultValue={clientId}>
                                {clients.map(client => {
                                    return (
                                        <option
                                        value={client._id}
                                        key={client._id}
                                        >
                                            {client.name}
                                        </option>
                                    )}
                                )
                                }
                            </select>
                        </LabelItem>

                        <LabelItem>
                            <span>Produto</span>
                            <div>
                                {/* Set products */}                        
                                <select id="selected-prod">
                                    {products.map(product => {return (
                                            <option value={product.id} key={product.id}>{product.name}</option>
                                        )})
                                    }
                                </select>

                                {/* Set add to cart button */}
                                <button type="button" onClick={() => {this.handleAddToCart()}}>
                                    <AddButton/>
                                </button>
                            </div>
                        </LabelItem>

                        {/* If there's no item in the cart... */}
                        {(!!!cart.length)
                            ?(<NoSales>Clique em "+" para adicionar produtos!</NoSales>)
                            
                            // Else...
                            :(<div>
                                {/* Render Table */}
                                <Table
                                cart={cart}
                                onDelete={this.handleDelete}
                                setTotalPrice={this.calcTotalPrice}/>
    
                                {/* Submit button and Sale stats holder */}
                                <StatsHolder>
                                    <SendButton type="submit" value="Atualizar"/>

                                    {/* Sale stats */}
                                    <div className="sale-stats">
                                        <label>
                                            <strong>Total:</strong>
                                            <input
                                            type="text"
                                            id="total-price"
                                            readOnly
                                            defaultValue="$0,00"/>
                                        </label>

                                        <label>
                                            <strong>Sugerido:</strong>
                                            <input
                                            type="text"
                                            id="diff-price"
                                            readOnly
                                            defaultValue="$0,00"/>
                                        </label>

                                        <label>
                                            <strong>Retabilidade:</strong>
                                            <input
                                            type="text"
                                            id="rent-price"
                                            readOnly/>
                                        </label>

                                    </div>
                                </StatsHolder>
                            </div>)}
                        </form>
                        ))}
            </section>
        );
    }
}
