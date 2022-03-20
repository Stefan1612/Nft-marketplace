const OwnNfts = (props) => {
  return (
    <div className="row " style={{ paddingTop: "20vh" }}>
      <form className="form-inline text-center">
        <i className="fas fa-cat"></i>
      </form>
      <br></br>
      {props.ownNFTs.length === 0 && (
        <h1 className="text-center " style={{ marginTop: "4vh" }}>
          You don't own any NFTs currently!
        </h1>
      )}
      <br></br>
      <div
        className="col-md-10 offset-md-1 d-flex justify-content-around"
        style={{ marginTop: "6vh" }}
      >
        {props.ownNFTs.map((index) => {
          return (
            <div
              key={index.tokenId}
              className="card col-md-2 tokenCard"
              style={{ marginLeft: "5px", height: "50vh" }}
            >
              <img
                alt="NFT"
                src={index.image}
                className=" card-img-top imageId"
              ></img>

              <div className="card-body">
                <div className="card-title" id="nftName">
                  {index.name}
                </div>
                <div className="card-text" id="nftDescription">
                  {index.description}
                </div>
                <div id="nftPrice">{index.price} Ether</div>

                <input
                  style={{ width: "100%" }}
                  onChange={(e) => props.handleChangePrice(e)}
                  placeholder="Put in Sale price"
                ></input>
                <button
                  className="btn-success"
                  style={{ width: "45%" }}
                  id="nftBuy"
                  onClick={() => props.sellNFT(index)}
                >
                  Sell NFT
                </button>
                <button
                  className="btn-danger"
                  style={{ width: "55%" }}
                  id="nftBuy"
                  onClick={() => props.deletingNFT(index)}
                >
                  Delete NFT
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div></div>
    </div>
  );
};

export default OwnNfts;
