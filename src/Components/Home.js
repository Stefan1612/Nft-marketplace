
const Home = (props) => {
    return (
        <div className="row " style={{paddingTop: "20vh"}}>
            <h1 className="text-center">This is Ape Gangs Marketplace</h1>
            <br></br>
            <form class="form-inline text-center">
            <input class="form-control mr-sm-2" type="text" placeholder="Search"/>
            <button class="btn btn-outline-success my-2 my-sm-0 " type="submit">Search</button><i class="fas fa-cat" ></i>
            </form>
            <br></br>
       {props.onSaleNFTs.length == 0 && <h1>There are no Tokens up for sale</h1>}
       <br></br>
        <div className="col-md-10 offset-md-1 d-flex justify-content-around" style={{marginTop: "6vh"}}>{
             props.onSaleNFTs.map(index => {
                return <div key={index.tokenId} className="card col-md-2 tokenCard" style={{marginLeft: "5px", height: "46vh" }}>
                    
                    <img src={index.image} className=" card-img-top imageId"  ></img>
                    
                    <div className="card-body">
                    <div className="card-title"id="nftName">{index.name}</div>
                    <div className="card-text"id="nftDescription">{index.description}</div>
                    <div id="nftPrice">{index.price} Ether</div>
                    <button className="btn btn-success" id="nftBuy" onClick={()=> props.buyNFT(index)}>
                        Buy NFT
                    </button>
                   
                    </div>
                </div>
            }) 
        }
                        
        </div>
      
        <div>               
        </div>
        
    </div>
    )
}

export default Home

