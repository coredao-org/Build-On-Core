import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { coreNetwork } from '@/constant/network';

import { CircleCheck, CircleX, LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';

export type STATUS = 'LOADING' | 'APPROVING' | 'SUCCESS' | 'ERROR';

export function useModal() {
  const [modalStatus, setModalStatus] = useState<STATUS>('LOADING');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHash, setModalHash] = useState('');
  return {
    modalStatus,
    setModalStatus,
    modalTitle,
    setModalTitle,
    modalOpen,
    setModalOpen,
    modalHash,
    setModalHash,
  };
}

export function LoadingModal({
  modalStatus = 'LOADING',
  modalOpen,
  setModalOpen,
  modalTitle = '',
  modalHash = '',
  closeParentModal
}: {
  modalStatus: STATUS;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  modalTitle: string;
  modalHash: string;
  closeParentModal?: () => void
}) {
  return (
    <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
      <AlertDialogContent className="p-0">
        <div className="relative py-6 space-y-2">
          {!['LOADING', 'APPROVING'].includes(modalStatus) && (
            <X
              className="absolute right-4 top-4 cursor-pointer"
              onClick={() => {
                setModalOpen(false);
                if(closeParentModal){
                  closeParentModal()
                }
              }}
            />
          )}
          <AlertDialogTitle className="text-center">
            {['LOADING', 'APPROVING'].includes(modalStatus) && 'Processing'}
          </AlertDialogTitle>

          {['LOADING', 'APPROVING'].includes(modalStatus) && (
            <LoaderCircle
              className="animate-spin text-muted-foreground mx-auto"
              size={80}
              strokeWidth={1}
            />
          )}
          {modalStatus === 'SUCCESS' && (
            <CircleCheck
              className="text-muted-foreground mx-auto"
              size={80}
              strokeWidth={1}
              color="#4BB543"
            />
          )}
          {modalStatus === 'ERROR' && (
            <CircleX
              className="text-muted-foreground mx-auto"
              size={80}
              strokeWidth={1}
              color="#FF9494"
            />
          )}
          <AlertDialogDescription className="text-center text-card-foreground">
            {modalTitle}
          </AlertDialogDescription>
          <div className="text-center">
            {modalHash && (
              <a
                className="text-sm text-muted-foreground"
                href={`${coreNetwork.blockExplorerUrl}/tx/${modalHash}`}
                target="_blank"
              >
                View at Core scan
              </a>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
