import { IconDatabaseImport, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";

// project import
import { StyledFab } from "@/modules/ai-builder/ui-component/button/StyledFab";

import UpsertResultDialog from "./UpsertResultDialog";
import VectorStoreDialog from "./VectorStoreDialog";

const VectorStorePopUp = ({ chatflowid }) => {
  const [open, setOpen] = useState(false);
  const [showExpandDialog, setShowExpandDialog] = useState(false);
  const [expandDialogProps, setExpandDialogProps] = useState({});
  const [showUpsertResultDialog, setShowUpsertResultDialog] = useState(false);
  const [upsertResultDialogProps, setUpsertResultDialogProps] = useState({});

  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const handleToggle = () => {
    setOpen((prevopen) => !prevopen);
    const props = {
      open: true,
      title: "Upsert Vector Store",
      chatflowid,
    };
    setExpandDialogProps(props);
    setShowExpandDialog(true);
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open, chatflowid]);

  return (
    <>
      <StyledFab
        sx={{ position: "absolute", right: 80, top: 20 }}
        ref={anchorRef}
        size="small"
        color="teal"
        aria-label="upsert"
        title="Upsert Vector Database"
        onClick={handleToggle}
      >
        {open ? <IconX /> : <IconDatabaseImport />}
      </StyledFab>
      <VectorStoreDialog
        show={showExpandDialog}
        dialogProps={expandDialogProps}
        onCancel={() => {
          setShowExpandDialog(false);
          setOpen((prevopen) => !prevopen);
        }}
        onIndexResult={(indexRes) => {
          setShowExpandDialog(false);
          setShowUpsertResultDialog(true);
          setUpsertResultDialogProps({ ...indexRes });
        }}
      />
      <UpsertResultDialog
        show={showUpsertResultDialog}
        dialogProps={upsertResultDialogProps}
        onCancel={() => {
          setShowUpsertResultDialog(false);
          setOpen(false);
        }}
      />
    </>
  );
};

VectorStorePopUp.propTypes = { chatflowid: PropTypes.string };

export default memo(VectorStorePopUp);
