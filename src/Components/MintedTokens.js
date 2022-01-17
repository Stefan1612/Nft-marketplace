

const MintedTokens = (props) => {
    return (
        <div className="row " style={{paddingTop: "20vh"}}>   
        <h1 className="text-center">Minted Nft list</h1>
            <br></br>
            <form class="form-inline text-center">
            <input class="form-control mr-sm-2" type="text" placeholder="Search"/>
            <button class="btn btn-outline-success my-2 my-sm-0 " type="submit">Search</button><i class="fas fa-cat" ></i>
            </form>
            <br></br>
        {props.mintedNFTs.length == 0 && <h1 className="text-center " style={{marginTop: "4vh"}}>You have not minted any NFTs yet!</h1>}
        <div className="col-md-10 offset-md-1 d-flex justify-content-around" style={{marginTop: "6vh"}}>
            {props.mintedNFTs.map(index => {
                return <div key={index.tokenId}className="card col-md-2 tokenCard" style={{marginLeft: "5px", height: "43vh" }} >
                    <img  className=" card-img-top imageId"  src={index.image}></img>
                    <div className="card-body">
                    <div className="card-title"id="nftName">{index.name}</div>
                    <div className="card-text"id="nftDescription">{index.description}</div>
                    <div id="nftPrice">{index.price} Ether</div>
                    </div>
                </div>
            })}               
        </div>
    </div>
    )
}

export default MintedTokens


