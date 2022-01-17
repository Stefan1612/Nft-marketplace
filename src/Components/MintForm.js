//rework this
const MintForm = (props) => {
    return (
        <div  className="row d-flex justify-content-around"style={{paddingTop: "300px",  height: "65vh"}}>
            <div  className="col-md-3 " style={{backgroundColor: "rgba(5, 10, 2, .4)", borderRadius: "3%", color: "black"}}>
                <h1 >Fill in the Form to mint a new NFT </h1>
                <h4 >(You must fill out every input field)</h4>
                <div >
                    Name:
                <input style={{width: "100%"}}placeholder="Name max 14 letters" type="text" maxlength="14"
                onChange={e => props.changeFormInputName(e)}
                />
                <br></br>
                Description:
                <textarea style={{width: "100%", backgroundColor: "rgb(161, 170, 169)"}}placeholder="Description max 70 letters" type="text" maxlength="70"
                onChange={e => props.changeFormInputDescription(e)}
                />
                    <br></br>
                    Choose the File to upload as NFT
                    <input style={{width: "100%", backgroundColor: "rgb(161, 170, 169)"}}type="file" name="Asset" onChange={props.onChange}
                    />
                    <button style={{width: "100%", backgroundColor: "rgb(206, 235, 183)"}}onClick={props.createMarket} > Mint NFT</button>

            </div >
            </div >
            
                    {
                props.fileURL && (
                    <div className="card col-md-2 tokenCard " style={{marginLeft: "5px", height: "43vh" }} >
                    <img  className=" card-img-top imageId"  src={props.fileURL}></img>
                    <div className="card-body">
                    <div className="card-title"id="nftName">"Name of NFT"</div>
                    <div className="card-text"id="nftDescription">"Description of NFT"</div>
                    <div id="nftPrice">"Price in Ether"</div>
                    </div>
                </div>
                    
                    )
                }
                
                <br></br>
                
                
            
            
        </div>
    )
}

export default MintForm
