"use client";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import PropTypes from "prop-types";
import { classNames } from "../../utils/index";

export const MoveBoxDialog = ({ open, setOpen, onConfirm }) => {
  return (
    <InputDialog
      setOpen={setOpen}
      open={open}
      onConfirm={onConfirm}
      isDestructive={true}
      title="Mover Produto de Caixa"
      subtitle="Digite o valor da nova caixa para o produto:"
      confirmText="Mover Produto"
    />
  );
};

MoveBoxDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onConfirm: PropTypes.func,
};

export const ActionDialog = ({ open, setOpen, onConfirm }) => {
  return (
    <InputDialog
      setOpen={setOpen}
      open={open}
      onConfirm={onConfirm}
      title="Criar novo nome para produto"
      subtitle="Digite o novo nome do produto:"
      confirmText="Confirmar"
    />
  );
};

ActionDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onConfirm: PropTypes.func,
};

const InputDialog = ({
  open,
  setOpen,
  onConfirm,
  isDestructive,
  title,
  subtitle,
  confirmText,
}) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <Dialog className="relative z-10" open={open} onClose={setOpen}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-2 text-center">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{subtitle}</p>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={classNames(
                  isDestructive ? "bg-red-600" : "bg-indigo-600",
                  "inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto",
                )}
                onClick={() => {
                  setOpen(false);
                  onConfirm(inputValue);
                }}
              >
                {confirmText}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

InputDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onConfirm: PropTypes.func,
  isDestructive: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  confirmText: PropTypes.string,
};
