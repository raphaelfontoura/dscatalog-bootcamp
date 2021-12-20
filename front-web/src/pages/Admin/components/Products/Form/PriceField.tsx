import CurrencyInput from "react-currency-input-field"
import { Control, Controller } from "react-hook-form"
import { FormState } from "."


type Props = {
  control: Control<FormState>
}

const PriceField = ({ control }: Props) => {
  return (
    <Controller
      name="price"
      rules={{
        required: {
          value: true,
          message: 'Campo obrigatório'
        }
      }}
      control={control}
      render={({ field }) => (
        <CurrencyInput
          placeholder="Preço"
          className="form-control input-base"
          value={field.value}
          intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
          onValueChange={field.onChange}
          
        />
      )}
    />
  )
}

export default PriceField
