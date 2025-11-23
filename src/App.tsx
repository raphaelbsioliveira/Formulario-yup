import "./styles.css";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    password: yup.string().required("Digite uma senha"),
    confirmPassword: yup.string().required("Confirme sua senha"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [submitted, setSubmitted] = useState(false);
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const canEnableButton = !!password && !!confirmPassword;

  // regras da senha
  const ruleMinLength = password?.length >= 8;
  const ruleUpper = /[A-Z]/.test(password || "");
  const ruleLower = /[a-z]/.test(password || "");
  const ruleNumber = /[0-9]/.test(password || "");
  const ruleSpecial = /[^A-Za-z0-9]/.test(password || "");

  const allValid =
    ruleMinLength &&
    ruleUpper &&
    ruleLower &&
    ruleNumber &&
    ruleSpecial &&
    password === confirmPassword;

  const successIcon =
    "https://w7.pngwing.com/pngs/312/807/png-transparent-computer-icons-check-mark-success-icon-cdr-angle-logo.png";

  const errorIcon =
    "https://w7.pngwing.com/pngs/972/387/png-transparent-abort-delete-no-cancel-locked-blocked-prohibited-denied-forbidden-icon-thumbnail.png";

  function renderValidationRow(valid: boolean, text: string) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginTop: "6px",
          color: valid ? "green" : "red",
        }}
      >
        <img src={valid ? successIcon : errorIcon} width={15} height={15} />
        <span>{text}</span>
      </div>
    );
  }

  function onSubmit(data: FormData) {
    setSubmitted(true);

    if (data.password === data.confirmPassword) {
      alert("SENHAS IGUAIS");
    } else {
      alert("SENHAS DIFERENTES");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nova senha</label>
        <br />
        <input
          type="password"
          placeholder="Digite sua senha"
          {...register("password")}
        />
      </div>

      <br />

      <div>
        <label>Confirmar nova senha</label>
        <br />
        <input
          type="password"
          placeholder="Digite sua senha"
          {...register("confirmPassword")}
        />

        {/* As senhas não coincidem */}
        {submitted &&
          password !== confirmPassword &&
          renderValidationRow(false, "As senhas não coincidem.")}

        {/* REGRAS DA SENHA — só aparecem se o usuário ERRAR alguma regra */}
        {submitted && !allValid && (
          <>
            {renderValidationRow(
              ruleMinLength,
              "A senha deve conter ao menos 8 caracteres."
            )}
            {renderValidationRow(
              ruleUpper,
              "A senha deve conter ao menos uma letra maiúscula."
            )}
            {renderValidationRow(
              ruleLower,
              "A senha deve conter ao menos uma letra minúscula."
            )}
            {renderValidationRow(
              ruleNumber,
              "A senha deve conter ao menos um número."
            )}
            {renderValidationRow(
              ruleSpecial,
              "A senha deve conter ao menos um caractere especial."
            )}
          </>
        )}
      </div>

      <br />

      <button type="submit" disabled={!canEnableButton}>
        Salvar
      </button>
    </form>
  );
}

export default App;
