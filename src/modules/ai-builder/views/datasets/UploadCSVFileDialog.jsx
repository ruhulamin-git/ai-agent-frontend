import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/modules/ai-builder/store/actions'

// Material
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material'

// Project imports
import { StyledButton } from '@/modules/ai-builder/ui-component/button/StyledButton'
import ConfirmDialog from '@/modules/ai-builder/ui-component/dialog/ConfirmDialog'
import { SwitchInput } from '@/modules/ai-builder/ui-component/switch/Switch'
import { File } from '@/modules/ai-builder/ui-component/file/File'
import { TooltipWithParser } from '@/modules/ai-builder/ui-component/tooltip/TooltipWithParser'

// Icons
import { IconX, IconDatabase } from '@tabler/icons-react'

// API
import datasetApi from '@/modules/ai-builder/api/dataset'

// utils
import useNotifier from '@/modules/ai-builder/utils/useNotifier'

// const
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/modules/ai-builder/store/actions'
const CSVFORMAT = `Only the first 2 columns will be considered:
----------------------------
| Input      | Output      |
----------------------------
| test input | test output |
----------------------------
`

const UploadCSVFileDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    const portalElement = typeof document !== 'undefined' ? (document.getElementById('portal') || document.body) : null

    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [datasetId, setDatasetId] = useState('')
    const [datasetName, setDatasetName] = useState('')
    const [firstRowHeaders, setFirstRowHeaders] = useState(false)
    const [selectedFile, setSelectedFile] = useState()
    const [dialogType, setDialogType] = useState('ADD')

    useEffect(() => {
        setDatasetId(dialogProps.data.datasetId)
        setDatasetName(dialogProps.data.datasetName)
        setDialogType('ADD')

        return () => {
            setDialogType('ADD')
            setDatasetId('')
            setDatasetName('')
            setFirstRowHeaders(false)
            setSelectedFile()
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const addNewDatasetRow = async () => {
        try {
            const obj = {
                datasetId: datasetId,
                firstRowHeaders: firstRowHeaders,
                csvFile: selectedFile
            }
            const createResp = await datasetApi.createDatasetRow(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New Row added for the given Dataset',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm(createResp.data.id)
            }
        } catch (error) {
            enqueueSnackbar({
                message: `Failed to add new row in the Dataset: ${
                    typeof error.response?.data === 'object' ? error.response?.data?.message : (error.response?.data || error.message)
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div
                        style={{
                            width: 50,
                            height: 50,
                            marginRight: 10,
                            borderRadius: '50%',
                            backgroundColor: 'white'
                        }}
                    >
                        <IconDatabase
                            style={{
                                width: '100%',
                                height: '100%',
                                padding: 7,
                                borderRadius: '50%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                    {'Upload Items to [' + datasetName + '] Dataset'}
                </div>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography>
                            Upload CSV
                            <TooltipWithParser style={{ mb: 1, mt: 2 }} title={`<pre>${CSVFORMAT}</pre>`} />
                        </Typography>
                        <div style={{ flexGrow: 1 }}></div>
                    </div>
                    <File
                        disabled={false}
                        fileType='.csv'
                        onChange={(newValue) => setSelectedFile(newValue)}
                        value={selectedFile ?? 'Choose a file to upload'}
                    />
                    <SwitchInput
                        value={firstRowHeaders}
                        onChange={setFirstRowHeaders}
                        label={'Treat First Row as headers in the upload file?'}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCancel()}>{dialogProps.cancelButtonName}</Button>
                <StyledButton
                    disabled={!selectedFile}
                    variant='contained'
                    onClick={() => (dialogType === 'ADD' ? addNewDatasetRow() : saveDatasetRow())}
                >
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return portalElement ? createPortal(component, portalElement) : null
}

UploadCSVFileDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default UploadCSVFileDialog
