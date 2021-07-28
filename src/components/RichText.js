import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, createEditor, Element as SlateElement, } from 'slate'
import { withHistory } from 'slate-history'
import '../App.css'
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, ZoomInOutlined, OrderedListOutlined, UnorderedListOutlined } from "@ant-design/icons"

import { Button } from 'antd'

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const RichText = ({ initialValue, cardList, setDataServer, id }) => {
    const [value, setValue] = useState(initialValue)
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    return (
        <Slate editor={editor} id={id} value={value} onChange={(value) => {
            setValue(value)
        }}>
            <div>
                <MarkButton format="bold" icon={<BoldOutlined />} />
                <MarkButton format="italic" icon={<ItalicOutlined />} />
                <MarkButton format="underline" icon={<UnderlineOutlined />} />
                <BlockButton format="heading-one" icon={<ZoomInOutlined className="btn" />} />
                <BlockButton format="heading-two" icon={<ZoomInOutlined />} />
                <BlockButton format="numbered-list" icon={<OrderedListOutlined />} />
                <BlockButton format="bulleted-list" icon={<UnorderedListOutlined />} />
            </div>
            <Editable
                className="Editable"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                id={id}
                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault()
                            const mark = HOTKEYS[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                    SetdDataToServer(event.target.id, value, cardList, setDataServer)
                }}
            />
        </Slate>
    )
}

const SetdDataToServer = (id, value, cardList, setDataServer) => {
    let result = cardList.map(card => {

        if (card.id + "" === id + "") {
            card.items = [...value]
        }
        return card
    })
    setDataServer(result)
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            LIST_TYPES.includes(
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
            ),
        split: true,
    })
    const newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        < Button
            className="bt"
            // active={isBlockActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {icon}
        </ Button>
    )
}

const MarkButton = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <Button
            className="bt"
            size="small"
            // active={isMarkActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

export default RichText