import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../App/store'
import {
  QCResults,
  propertyNamesMap,
  ProbedMetadata,
  videoProfileInterface,
} from './uploadSlice'
import '../styles/results.css'

const Results: React.FC = () => {
  const qcResults = useSelector((state: RootState) => state.upload.qcResults)

  //sets state of metadata displayed in table
  const probedMetadata = useSelector(
    (state: RootState) => state.upload.probedMetadata
  )

  //sets state of of which video profile the user is using
  const videoProfileInterface = useSelector(
    (state: RootState) => state.upload.videoProfileInterface
  )
  //loading state
  const isLoading = useSelector((state: RootState) => state.upload.isLoading)

  if (isLoading) {
    return <p>Loading results...</p>
  }

  //null by default
  if (!qcResults || !probedMetadata || !videoProfileInterface) {
    return null
  }

  // helper function to render checkmark or X
  const renderCheckmarkOrX = (value: boolean) => {
    const style = { color: value ? 'green' : 'red' }
    const symbol = value ? '✓ PASS' : '✗ FAIL'
    return <span style={style}>{symbol}</span>
  }

  //special case to convert bitrate units from bytes to killobytes
  const convertBitrateToKilobits = (bitrate: number): number => {
    return bitrate / 1000
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
            <th>Profile Metadata</th>
          </tr>
        </thead>
        <tbody>
          {/* map qc results from api to prefered names on display */}
          {Object.entries(qcResults).map(([key, value]) => (
            <tr key={key}>
              <td>{propertyNamesMap[key as keyof QCResults]}</td>
              <td>{renderCheckmarkOrX(value)}</td>
              <td>
                {/* key of metadata extract to display on page with the exceptions below */}
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
                        {probedMetadata[key as keyof ProbedMetadata]} fps
                      </span>
                    )}
                  </>
                )}
              </td>
              <td>
                {key in videoProfileInterface && (
                  <>
                    {key !== 'bitrate' &&
                      key !== 'audio_bitrate' &&
                      key !== 'width' &&
                      key !== 'height' &&
                      key !== 'sample_rate' &&
                      key !== 'r_frame_rate' && (
                        <span>
                          {
                            videoProfileInterface[
                              key as keyof videoProfileInterface
                            ]
                          }
                        </span>
                      )}
                    {key === 'bitrate' &&
                      typeof videoProfileInterface[
                        key as keyof videoProfileInterface
                      ] === 'string' && (
                        <span>
                          {/* ranges are stored as string arrays in databse. replace with range instead of array */}
                          {String(
                            videoProfileInterface[
                              key as keyof videoProfileInterface
                            ]
                          )
                            .replace('[', '')
                            .replace(']', '')
                            .replace(',', ' - ')}{' '}
                          kbps
                        </span>
                      )}
                    {key === 'audio_bitrate' &&
                      typeof videoProfileInterface[
                        key as keyof videoProfileInterface
                      ] === 'string' && (
                        <span>
                          {String(
                            videoProfileInterface[
                              key as keyof videoProfileInterface
                            ]
                          )
                            .replace('[', '')
                            .replace(']', '')
                            .replace(',', ' - ')}{' '}
                          kbps
                        </span>
                      )}
                    {(key === 'width' || key === 'height') && (
                      <span>
                        {
                          videoProfileInterface[
                            key as keyof videoProfileInterface
                          ]
                        }{' '}
                        px
                      </span>
                    )}
                    {key === 'sample_rate' && (
                      <span>
                        {
                          videoProfileInterface[
                            key as keyof videoProfileInterface
                          ]
                        }{' '}
                        kHz
                      </span>
                    )}
                    {key === 'r_frame_rate' && (
                      <span>
                        {
                          videoProfileInterface[
                            key as keyof videoProfileInterface
                          ]
                        }{' '}
                        fps
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
