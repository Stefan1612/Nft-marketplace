import {Link} from "react-router-dom"
const Navbar = () => {
    return (
        <div id="Navbar" > 
            <Link to="/" className="Nav ">Main  </Link>
            <Link to="/MintedTokens" className="Nav">Minted Tokens  </Link>
            <Link to="/MintForm" className="Nav">Mint NFT  </Link>
            <Link to="/OwnNfts" className="Nav">Owned Nft list  </Link>
        </div>
    )
}

export default Navbar
