import './App.css';
import Header from './components/Header';
import ToolBody from './components/ToolBody';
import Container from 'react-bootstrap/esm/Container';
import { useState, CSSProperties } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configData from "./config.json";

function App() {
  
  const override = {
    display: "block",
    margin: "5% auto",
    borderColor: "black",
  };

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#aff593");
  let [ytDownloadLink, setYtDownloadLink] = useState("");

  function displayLoading(state){
    setLoading(state);
  }

  function renderToast(){
    return <ToastContainer autoClose={3000} theme='colored'/>;
  }
  function displayToast(message, msgType){
        
    switch(msgType){
        case "error":
            toast.error(message)
            break;
        case "info":
            toast(message)
            break;
        case "success":
            toast.success(message)
            break;
    }
  } 
  
  return (
    <div className="App">
      <Container>
        <Row style={{margin: "0% 5%"}}>
          <Card style={{margin: "0.5% 0%"}}>
              <Header text = "Video audio downloader tool" />

              <Card.Body style={{textAlign: "left"}}>
                <p>
                  Welcome to the video audio downloader tool page. 
                  Type in a video link into the input field and click the yellow download button. 
                  In the tool running download process, audio .mp3 file is created and added into a .zip archive file, 
                  which will be downloaded to your device.
                </p>
                <hr/>
                <p>
                  Currently: the tool supports youtube video urls and .mp3 audio file format<br/>
                  Not supported: other audio formats, youtube playlists and other social network platform urls 
                  </p>               
              </Card.Body>
          </Card>
        </Row>

        <Row style={{margin: "0% 5%"}}>
          <Card bg="light" border="secondary">            
            <Card.Body style={{backgroundColor: "#ffffff", borderColor: "grey", borderWidth: "2px"}}>
              <ToolBody 
                renderToast={renderToast} 
                displayToast={displayToast} 
                displayLoading={displayLoading} 
                setYtDownloadLink ={setYtDownloadLink} />          
            </Card.Body>
          </Card>
        </Row>

        <Row style={{margin: "0% 5%"}}>
           <Card style={{height: "25%", margin: "0.5% 0%"}}>
                <Card.Header>
                    <h3 style={{textAlign:"left"}}>Downloading</h3>
                </Card.Header>

                {loading ? <Row>            
                  <Col lg={6}>
                    <p style={{textAlign: "left", margin: "5% 2%"}}>
                      Downloading audio file using link:<br/>
                      <b>{ytDownloadLink}</b>
                    </p>
                  </Col>
                  <Col lg={6}>
                    <BounceLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={80}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </Col>
                </Row> : <Row>
                  <Card>
                    <p style={{margin: "2%", textAlign: "left"}}>No audio video is downloading!</p>
                  </Card>
                </Row>}
                
            </Card>
        </Row>       
       
      </Container>
    </div>
  );
}

export default App;
