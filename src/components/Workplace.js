import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
import { Button, Input } from 'antd';
import "../App.css"
import { DeleteOutlined, SoundOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons"
import firebase from 'firebase'
import RichText from "./RichText"
import audioPlay from './audio/audioPlay';
import fire from './fire';
import { connect } from "react-redux"
import { SET_CARD_LIST, SET_SONG } from '../store/actions/actionTypes';


const Workplace = (props) => {

    let ref = useRef()
    let renameIn = useRef()
    let renameDiv = useRef()
    let cards = useRef()

    const handleLogout = () => {
        fire.auth().signOut()
    }

    let email = localStorage.getItem("email")

    function setDataServer(data) {
        firebase.firestore().collection(`${email}`).doc("beeweb").set({
            data: data
        })
    }



    useEffect(() => {
        firebase.firestore().collection(`${email}`).get().then(result => {
            result.docs.map(doc => doc.data().data !== undefined ? props.setCardLists(doc.data().data) : props.setCardLists([]))
        })
    }, [])

    const [toggleId, setToggleId] = useState(null)
    const [dragStartHandlerId, setDragStartHandlerId] = useState()
    const [dragOverHandlerId, setDragOverHandlerId] = useState()

    const addLists = () => {
        props.setCardLists([...props.cardList, { id: props.cardList.length, order: props.cardList.length, title: `Click to change title`, items: [] }])
        setDataServer([...props.cardList, { id: props.cardList.length, order: props.cardList.length, title: `Click to change title`, items: [] }])
    }

    function dragStartHandler(e, card) {
        setDragStartHandlerId(e.target.id)
        e.target.style.cssText = `
        transform: rotate(3deg);
        transition: 200ms;
        `
    }
    function dragEndHandler(e) {
        if (e.target.className === "card") {

            e.target.style.cssText = "  box-shadow:  5px 5px 7px black"
            e.target.style.cssText = `
        transform: rotate(0deg);
        transition: 200ms;
        `
        }
    }
    function dragOverHandler(e) {
        e.preventDefault()
        setDragOverHandlerId(e.target.id)
        if (e.target.className === "card") {
            e.target.style.cssText = "  box-shadow:  0px 0px 15px chartreuse"
        }

    }
    function dropHandler(e, card) {
        e.preventDefault()
        if (e.target.className === "card") {
            e.target.style.cssText = "  box-shadow:  5px 5px 7px black"
            cardsMoving()
        }
    }
    function cardsMoving() {
        let newCardList = props.cardList

        let temporaryObjectOne = newCardList[dragStartHandlerId].title
        newCardList[dragStartHandlerId].title = newCardList[dragOverHandlerId].title
        newCardList[dragOverHandlerId].title = temporaryObjectOne
        let temporaryObjectTwo = [...newCardList[dragStartHandlerId].items]
        newCardList[dragStartHandlerId].items = [...newCardList[dragOverHandlerId].items]
        newCardList[dragOverHandlerId].items = temporaryObjectTwo

        setDataServer(newCardList)
        setTimeout(() => {
            props.setCardLists([])
        }, 1);
        setTimeout(() => {
            props.setCardLists([...newCardList])
        }, 5);
    }

    function dellCard(e, id) {
        let newCardList = props.cardList.filter(card => card.id !== id)
        newCardList = newCardList.map((card, index) => {
            return {
                ...card,
                id: index
            }
        })
        props.setCardLists(newCardList)
        setDataServer(newCardList)
    }

    function toggleDiv(cardId) {
        renameDiv.current.classList.toggle("renameDivTogle")
        renameIn.current.focus()
        setToggleId(cardId)
    }
    function rename() {
        let newValue = renameIn.current.state.value
        if (newValue) {

            newValue = newValue.slice(0, 1).toUpperCase() + newValue.slice(1, 30)
            renameIn.current.state.value = ""
            let newCardList = props.cardList.map(card => {
                if (card.id === toggleId && newValue !== "") card.title = newValue
                return card
            })
            setTimeout(() => {

                props.setCardLists([...newCardList])
            }, 200);
            setDataServer(newCardList)
        }
        renameDiv.current.classList.toggle("renameDivTogle")
    }

    return (
        <section className="hero">
            <nav>
                <h2>Welcome <SoundOutlined ref={ref} className="song" onClick={(e) => {
                    props.setSong()
                    ref.current.classList.toggle("color")
                }} />

                </h2>
                <div className="renameDiv" ref={renameDiv}>
                    <Input className="renameIn" ref={renameIn} placeholder=" Enter a new name" onKeyDown={(e) => {
                        if (e.keyCode === 13) rename()
                        if (e.keyCode === 27) renameDiv.current.classList.toggle("renameDivTogle")
                    }} />
                    <CloseOutlined className="closeBt" onClick={() => renameDiv.current.classList.toggle("renameDivTogle")} />
                    <CheckOutlined className="renameBt" onClick={rename} />
                </div>
                <Button size="large" onClick={() => {
                    audioPlay(null, props.song)
                    addLists()
                }} >+ Add</Button >
                <Button size="large" onClick={() => {
                    handleLogout()
                    localStorage.clear()
                }} >Logout</Button >
            </nav>
            <section className='listsWraper'>
                {props.cardList ? props.cardList.map((card, index) => {
                    return <div
                        onDragStart={e => dragStartHandler(e, card)}
                        onDragLeave={e => dragEndHandler(e)}
                        onDragEnd={e => dragEndHandler(e)}
                        onDragOver={e => dragOverHandler(e)}
                        onDrop={e => dropHandler(e, card)}
                        draggable={true}
                        key={index}
                        className="card"
                        id={index}
                        ref={cards}
                    >
                        <div >
                            <span className="cardTitle" onClick={() =>
                                toggleDiv(card.id)

                            }>{card.title}</span>
                            <div className="dellCardDiv">
                                <Button className="dellCard" size="small" onClick={(e) => {
                                    dellCard(e, card.id)
                                    audioPlay("DELETE", props.song)
                                }} ><DeleteOutlined /></Button >
                            </div>
                            <hr />
                            <RichText initialValue={card.items.length === 0 ? props.initialItemsValue : card.items} cardList={props.cardList} id={card.id} setDataServer={setDataServer} />

                        </div>

                    </div>
                }) : null}
            </section>
        </section>
    )

}


function mapStateToProps(state) {
    return {
        song: state.song,
        cardList: state.cardList,
        initialItemsValue: state.initialItemsValue
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setCardLists: (newCardList) => dispatch({ type: SET_CARD_LIST, newCardList: newCardList }),
        setSong: () => dispatch({ type: SET_SONG })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Workplace)