import { useState } from "react";
import { Sheet } from "react-modal-sheet";

// Snap points: 200px collapsed, 50% half-open, 85% expanded
const snapPoints = [0, 200, 0.5, 0.85, 1];
const initialSnap = 1; // Start at collapsed (200px)

export default function BottomSheet({ children }) {
  const [isOpen, setOpen] = useState(true);
  const [snapPoint, setSnapPoint] = useState(initialSnap);

  return (
    <Sheet
      isOpen={isOpen}
      snapPoints={snapPoints}
      initialSnap={initialSnap}
      disableDismiss
      onClose={() => setOpen(false)}
      onSnap={setSnapPoint}
    >
      <Sheet.Container className="!bg-surface-900/80 backdrop-blur-lg !rounded-t-3xl !border-t !border-surface-600">
        <Sheet.Header className="flex justify-center py-2">
          {/* Drag handle */}
          <div className="w-12 h-1.5 bg-surface-600 rounded-full" />
        </Sheet.Header>

        <Sheet.Content
          disableScroll={(state) => state.currentSnap < snapPoints.length - 3}
          className="pb-10"
        >
          <div className="px-3">{children}</div>
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop />
    </Sheet>
  );
}
