import MonacoEditor from "@monaco-editor/react";
import { FC, useCallback, useState } from "react";
import axios from "axios";
import * as monaco from "monaco-editor";

interface EditorProps {
  onExec?(code: string): void;
}

export const Editor: FC<EditorProps> = ({ onExec }) => {
  const [code, setCode] = useState<string>(`[
  cube().subtract(
    sphere({
      radius: 1.3,
      slices: 16,
      stacks: 8,
    })
  )
]`);
  const onMountHandler = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      editor.addAction({
        // An unique identifier of the contributed action.
        id: "exec-csg-code",

        // A label of the action that will be presented to the user.
        label: "执行",

        // An optional array of keybindings for the action.
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyE,
        ],

        // // A precondition for this action.
        // precondition: null,

        // // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        // keybindingContext: null,

        contextMenuGroupId: "navigation",

        contextMenuOrder: 1.5,

        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convenience
        run() {
          if (code) onExec?.call(null, editor.getValue());
        },
      });
    },
    [code, onExec]
  );

  return (
    <MonacoEditor
      language="typescript"
      loading=""
      height="100%"
      theme="vs-dark"
      value={code}
      onChange={(val) => {
        if (!val) return;
        setCode(val);
        localStorage.setItem("csg-code", val);
      }}
      beforeMount={async (monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2016,
          allowNonTsExtensions: true,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        });
        const cgsdts = await axios.get("/csg.d.ts");
        monaco.languages.typescript.typescriptDefaults.addExtraLib(cgsdts.data);
      }}
      onMount={onMountHandler}
    />
  );
};
