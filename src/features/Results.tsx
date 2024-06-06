import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../App/store'
import { QCResults, propertyNamesMap, ProbedMetadata } from './uploadSlice'
import '../styles/results.css'

const Results: React.FC = () => {
  const qcResults = useSelector((state: RootState) => state.upload.qcResults)
  const probedMetadata = useSelector(
    (state: RootState) => state.upload.probedMetadata
  )
  const isLoading = useSelector((state: RootState) => state.upload.isLoading)

  if (isLoading) {
    return <p>Loading results...</p>
  }

  if (!qcResults || !probedMetadata) {
    return null
  }

  // Helper function to convert bitrate from bits to kilobits
  const convertBitrateToKilobits = (bitrate: number): number => {
    return bitrate / 1000
  }

  // Helper function to format frame rate
  const formatFrameRate = (frameRate: string): string => {
    const [numerator] = frameRate.split('/')
    const fps = Number(numerator) / 1000
    return fps.toString()
  }

  // Helper function to render checkmark or X
  const renderCheckmarkOrX = (value: boolean) => {
    const style = { color: value ? 'green' : 'red' }
    const symbol = value ? '✓ PASS' : '✗ FAIL'
    return <span style={style}>{symbol}</span>
  }

  return (
    <div className="results-container">
      <h2>Results:</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Metadata Type</th>
            <th>QC Status</th>
            <th>Uploaded File Metadata</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(qcResults).map(([key, value]) => (
            <tr key={key}>
              <td>{propertyNamesMap[key as keyof QCResults]}</td>
              <td>{renderCheckmarkOrX(value)}</td>
              <td>
                {key in probedMetadata && (
                  <>
                    {key !== 'bitrate' &&
                      key !== 'audio_bitrate' &&
                      key !== 'width' &&
                      key !== 'height' &&
                      key !== 'sample_rate' &&
                      key !== 'r_frame_rate' && (
                        <span
                          style={value ? { color: 'green' } : { color: 'red' }}
                        >
                          {probedMetadata[key as keyof ProbedMetadata]}
                        </span>
                      )}
                    {(key === 'bitrate' || key === 'audio_bitrate') && (
                      <span
                        style={value ? { color: 'green' } : { color: 'red' }}
                      >
                        {convertBitrateToKilobits(
                          Number(probedMetadata[key as keyof ProbedMetadata])
                        )}{' '}
                        kbps
                      </span>
                    )}
                    {(key === 'width' || key === 'height') && (
                      <span
                        style={value ? { color: 'green' } : { color: 'red' }}
                      >
                        {probedMetadata[key as keyof ProbedMetadata]} px
                      </span>
                    )}
                    {key === 'sample_rate' && (
                      <span
                        style={value ? { color: 'green' } : { color: 'red' }}
                      >
                        {probedMetadata[key as keyof ProbedMetadata]} kHz
                      </span>
                    )}
                    {key === 'r_frame_rate' && (
                      <span
                        style={value ? { color: 'green' } : { color: 'red' }}
                      >
                        {formatFrameRate(
                          probedMetadata[key as keyof ProbedMetadata].toString()
                        )}
                      </span>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Results
