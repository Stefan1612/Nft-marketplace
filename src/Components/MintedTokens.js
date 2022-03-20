const MintedTokens = (props) => {
  return (
    <div className="row " style={{ paddingTop: "20vh" }}>
      <form className="form-inline text-center">
        <i className="fas fa-cat"></i>
      </form>
      <br></br>
      {props.mintedNFTs.length === 0 && (
        <h1 className="text-center " style={{ marginTop: "4vh" }}>
          You have not minted any NFTs yet!
        </h1>
      )}
      <div
        className="col-md-10 offset-md-1 d-flex justify-content-around"
        style={{ marginTop: "6vh" }}
      >
        {props.mintedNFTs.map((index) => {
          return (
            <div
              key={index.tokenId}
              className="card col-md-2 tokenCard"
              style={{ marginLeft: "5px", height: "43vh" }}
            >
              <img
                alt="NFT"
                className=" card-img-top imageId"
                src={index.image}
              ></img>
              <div className="card-body">
                <div className="card-title" id="nftName">
                  {index.name}
                </div>
                <div className="card-text" id="nftDescription">
                  {index.description}
                </div>
                <div id="nftPrice">{index.price} Ether</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MintedTokens;
