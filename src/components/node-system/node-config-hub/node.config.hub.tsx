import React, { useEffect } from 'react'
import MixerUI from './mixer/mixer'
import "./node.config.hub.scss"

interface NodeConfigHubProps {
  addChannel: (
    channelName: string,
    channelNumber: number
  ) => void
}

const NodeConfigHub: React.FC<NodeConfigHubProps> = ({addChannel}) => {

  useEffect(() => {
    addChannel("channel", 1)
  }, [])

  return (
    <div className='node-config-hub-container'>
      <div className='node-config-hub'>
        <div className='node-config-hub-dock'>
          <MixerUI />
        </div>
      </div>
    </div>
  )
}

export default NodeConfigHub