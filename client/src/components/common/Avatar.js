import React, { useState, useEffect } from 'react'

export default function Avatar(path) {
    const [newPath, setNewPath] = useState('')

    useEffect(() => {
        if(path.path) {
            return setNewPath(path.path.replace(/^'(.*)'$/, '$1'))
        }

        setNewPath(path)
    }, [path])
    
    
    return (
        <div className='avatar'>
            <img src={`/${newPath}`} alt=""/>
        </div>
    )
}