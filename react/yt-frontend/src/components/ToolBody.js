import Col from "react-bootstrap/esm/Col"
import Row from "react-bootstrap/esm/Row"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { useState } from "react";
import configData from "../config.json";


function ToolBody(props) {
  const API_URL = configData.API_URL;
  const downloadedAudioFileName = configData.downloadedAudioFileName;
  const serverPort = configData.serverPort;
  const downloadRoute = configData.downloadRoute;
  const [downloadLink, setDownloadLink] = useState("");
  const [submitInputGUIState, setSubmitInputGUIState] = useState(false);
  const urlPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
  
  var downloadAPIUrl = "";

  function handleLinkInput(event){
    event.preventDefault();   

    const currentLinkTextValue = event.target.value;

    setDownloadLink(currentLinkTextValue);
  } 

  //For downloading youtube files
  async function downloadAudioFile(event){
    event.preventDefault();
    setSubmitInputGUIState(true);
    props.displayLoading(true);

    var validYtLink = urlPattern.test(downloadLink); 

    //Youtube link validation
    if (!validYtLink){
      console.log("Error! Invalid link in the input text field.");
      setSubmitInputGUIState(false);
      props.displayLoading(false);
      props.displayToast("Error! Invalid link in the input text field", "error");
      return;
    }

    props.setYtDownloadLink(downloadLink);

    console.log("Trying to connect to the download API");
    console.log(`Using ${downloadLink}`);

    const formData = new FormData();
    formData.append("ytLink", downloadLink);

    if (serverPort > 0)
        downloadAPIUrl = `${API_URL}:${serverPort}/${downloadRoute}`;
    else
        downloadAPIUrl = `${API_URL}/${downloadRoute}`;

    console.log(`Using API_URL=${downloadAPIUrl}`)

    // const params = new FormData();
    // params.append("ytLink", downloadLink);
    
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' 
    //     },
    //     body: params 
    // };

    // fetch(downloadAPIUrl, options )
    // .then( function(responseData){
    //     console.log(responseData);
    // })
    // .catch(error => console.log(error));

    await axios.post(downloadAPIUrl, 
    {
        "ytLink" : downloadLink
    }, 
    {
        headers: { 
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' 
        },
        responseType: "arraybuffer"
    }
    ).then((res) => {
        console.log(res);
        const downloadData = res.data;
        const url = window.URL.createObjectURL(new Blob([downloadData], { type: "application/zip" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${downloadedAudioFileName}.zip`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        
        setSubmitInputGUIState(false);
        props.displayLoading(false);
        props.displayToast("Audio file zip archive downloaded!", "success");

    }).catch(
        function(error){
            console.log(error);
            props.displayToast("Can not download the audio file at the moment. Please try again later!", "error");
            props.displayLoading(false);
            setSubmitInputGUIState(true);
        }
        );

  }

  return (           
    <Row style={{margin: "0px", textAlign: "left"}}>
        {props.renderToast()}
        <Form>
            <Form.Group className="mb-3" controlId="formDowndloadLinkField">
                <Row style={{margin: "2% 0%"}}>
                    <Col lg={3}>
                        <Form.Label style={{margin: "5% 0%"}}>Download audio file by link:</Form.Label>
                    </Col>
                    <Col lg={12}>
                        <Form.Control type="text" placeholder="Input your youtube link here..." onChange={handleLinkInput} disabled={submitInputGUIState}/>  
                    </Col>
                    <Col lg={6}>
                        <Button style={{margin: "5% 0%"}} variant="warning" type="submit" onClick={(event) => downloadAudioFile(event)} disabled={submitInputGUIState}>
                            Download (.mp3)
                        </Button>
                    </Col>
                </Row>                
                                              
            </Form.Group>
            
            
        </Form>
    </Row>        
  
  )
}

export default ToolBody