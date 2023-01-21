import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse,
    Form, FormGroup, Label, Input, FormText, CardBody, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { path } from 'config.js'
import firebase from 'firebase';

export default class RSVP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalRSVP:false,
            emailChecker: [],
            loadButt: false,
            response: '',
            time: '12pm - 1.30pm',
            name:'',
            pax: 0,
            message:'',
        };
    }
    handleChange = (evt) => {
        this.setState({ [evt.target.name]: evt.target.value });
    }
    toggleRSVP = () => {
        this.setState({
            modalRSVP : !this.state. modalRSVP,
        })
    }
    toggleREMINDER = () => {
        this.setState({
            modalReminder : !this.state. modalReminder,
        })
    }

    _markResponse = (response) => {
        this.setState({response: response})
    }
    _save = () => {
        const { response, name, pax, message, time } = this.state;
        this.setState({loadButt: true})
        if(response === '') {
            alert('Please pick your response!')
            return;
        }
        if(name === '') {
            alert('Please fill in your name!')
            return;
        }
        // console.log(name, response, pax, message);
        if(response === 'going'){
            let GOING_ID = firebase.database().ref(`${path}/RSVP/going/`).push().getKey()

            if(message !== ''){
                firebase.database().ref(`${path}/guestbook/${GOING_ID}`).update({
                    name: name,
                    time: time,
                    pax: parseInt(pax),
                    attendance: 'Going',
                    message: message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                })
            }

            firebase.database().ref(`${path}/RSVP/going/${GOING_ID}`).update({
                name: name,
                time: time,
                pax: parseInt(pax),
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                this.setState({ response:'', name:'', pax:0, message:'', loadButt: false }, () => {
                    this.props.parentRefresh()
                    this.toggleRSVP();
                });
            })
        }
        if(response === 'not going'){
            let NOT_ID = firebase.database().ref(`${path}/RSVP/not_going/`).push().getKey()

            if(message !== ''){
                firebase.database().ref(`${path}/guestbook/${NOT_ID}`).update({
                    name: name,
                    pax: 0,
                    attendance: 'Not Going',
                    message: message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                })
            }

            firebase.database().ref(`${path}/RSVP/not_going/${NOT_ID}`).update({
                name: name,
                // pax: pax,
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                this.setState({ response:'', name:'', pax:0, message:'', loadButt: false }, () => {
                    this.props.parentRefresh()
                    this.toggleRSVP();
                });
            })
        }

        
    }

    _renderResponse = () => {
        let display, form_content, {response} = this.state;

        if(response === ''){
            form_content = <div className="text-center mt-4 mb-3">Click on the buttons above to mark your attendance</div>
        }
        if(response !== ''){
            form_content =
            <div className="mt-4 mb-3">
                {
                    response === 'going' ?
                    <FormGroup>
                        <h6 className="mb-0 mt-4" style={{color:'red'}}>Important!</h6>
                        <Label for='time'><span style={{fontSize:'1.3rem'}}>Select the approximate time you will be arriving</span></Label>
                        <Input type='select' name='time' id='time' onChange={this.handleChange} value={this.state.time}>
                            <option value={"12pm - 1.30pm"}>12pm - 1.30pm</option>
                            <option value={"1.30pm - 3pm"}>1.30pm - 3pm</option>
                        </Input>
                    </FormGroup> : null
                }

                <FormGroup>
                    <Label for='name'><span style={{fontSize:'1.3rem'}}>Name</span></Label>
                    <Input type='text' name='name' id='name' onChange={this.handleChange}/>
                </FormGroup>

                {
                    response === 'going' ?
                    <FormGroup>
                        <Label for='pax'><span style={{fontSize:'1.3rem'}}>Will you be bringing a plus one? If yes, please mention how many.</span><br/>(Spouse, partner, family member)</Label>
                        <Input type='number' name='pax' id='pax' onChange={this.handleChange}/>
                    </FormGroup> : null
                }

                <FormGroup className="mb-3">
                    <Label for='message'><span style={{fontSize:'1.3rem'}}>Leave a message for the guestbook</span> (Optional)</Label>
                    <Input type='textarea' name='message' id='message' onChange={this.handleChange}/>
                </FormGroup>
            </div>
        }


        display =
        <>
            <div style={{display:'flex', justifyContent:'center'}}>
                <Button onClick={() => {this._markResponse('not going')}} style={{flex:'1', margin:'0 5px'}} color="danger">Not Going</Button>{' '}
                
                <Button onClick={() => {this._markResponse('going')}} style={{flex:'1', margin:'0 5px'}} color="success">Going</Button>
            </div>

            {form_content}
        </>
        

        return display;
    }
    _renderButton = () => {
        let display, { loadButt } = this.state;

        if(loadButt === false){
            display = <Button color='default' onClick={this._save}>Confirm</Button>
        }
        if(loadButt === true){
            display = <Button disabled color='primary' style={{display:'flex', alignItems:'center'}} onClick={this._save}><div>Saving</div><div className="buttonloader ml-2"></div></Button>
        }

        return display;
    }
    render() {
        // console.log(this.props);
        
        return (
            <div>
                <Button onClick={this.toggleREMINDER} color="primary" style={{...styles.RSVP, margin:'0'}}>RSVP</Button>

                {/* ===toggleRSVP=== */}
                <Modal className="modal-dialog-centered modal-default" style={{maxWidth:'425px', color:'white'}} isOpen={this.state.modalRSVP} toggle={this.toggleRSVP}>
                    <ModalHeader toggle={this.toggleRSVP}>RSVP</ModalHeader>
                    <ModalBody>
                        <p className="text-center mb-4 mt-2 h4 text-white">Confirm attendance</p>

                        {this._renderResponse()}
                    </ModalBody>
                    <ModalFooter>
                        {this._renderButton()}{' '}
                        <Button className='ml-auto text-white' color='link' onClick={() => {
                            this.setState({ response:'', name:'', pax:0, message:'' });
                            this.toggleRSVP();
                        }}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalReminder} toggle={() => this.toggleModal('modalReminder')} className='modal-dialog-centered modal-default'>
                    {/* <ModalHeader toggle={() => this.toggleModal('modalReminder')}></ModalHeader> */}
                    <ModalBody className="text-white">
                        <div className="mb-4">
                            <h6 className="text-white">Kepada para tetamu yang dihormati, sekiranya anda ingin memilih RSVP 'Going' sila pilih slot anda dan sila datang tepat pada masa yang akan ditetapkan bagi memastikan kelancaran <b>Majlis norma baru</b></h6>
                        </div>
                        <div className="mb-4">
                            <p className="m-0 mb-3 font-weight-bold text-white text-center">ANDA WAJIB MENGIKUTI SOP YANG TELAH DITETAPKAN</p>
                            <div style={{lineHeight:'1', fontWeight:'bold'}} className="mb-2">✅ Memakai mask</div>
                            <div style={{lineHeight:'1', fontWeight:'bold'}} className="mb-2">✅ Scan QR Code</div>
                            <div style={{lineHeight:'1', fontWeight:'bold'}} className="mb-2">✅ Menjaga penjarakan sosial</div>
                            <div style={{lineHeight:'1', fontWeight:'bold'}} className="mb-2">✅ Mengikuti masa yang ditetapkan</div>
                        </div>

                        <div>
                            <h6 className="text-white mb-3">Sekiranya anda memilih untuk menekan butang <b>'Seterusnya'</b> anda <b>DIWAJIBKAN</b> untuk patuh S.O.P. yang telah ditetapkan mengikut langkah-langkah yang ditetapkan oleh <b>KEMENTERIAN KESIHATAN MALAYSIA</b></h6>

                            <h6 className="text-white">Sekiranya pihak anda gagal untuk membuat demikian, pihak kami mempunyai hak untuk mengambil tindakan selanjutnya untuk tidak membenarkan anda hadir majlis tersebut</h6>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button color='primary'>Save changes</Button> */}
                        <Button className='ml-auto' color='dark' onClick={() => {
                            this.toggleREMINDER()
                            this.toggleRSVP()
                        }}>Seterusnya</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const styles = {
    RSVP : {
        fontWeight:'bold',
        background: '#927878',
        position: 'absolute',
        top: '-35px',
        left:'50%',
        padding: '30px 8px',
        transform: 'translateX(-50%)',
        width: '70px',
        fontSize:'14px',
        lineHeight:'14px',
        border: 'none',
        borderRadius: '50%',
        border:'2px solid',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px -1px 6px, rgba(0, 0, 0, 0.23) 0px -1px 6px',
    }
}