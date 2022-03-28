import { Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { RuleType } from "api/rule_setting"
import { Field, FieldProps, Form, Formik } from "formik"
import { useTranslation } from "next-i18next"

const RuleBaseInfo: React.FunctionComponent<{ rule: RuleType, setTabIndex: any, setRuleInfo: any }> =
  ({ rule, setTabIndex, setRuleInfo }) => {
  const { t } = useTranslation()
    const onSubmit = async (values: RuleType) => {
      console.log("values: ", values)
      setTabIndex(1)
      setRuleInfo(values)
    }
  function validateName(value: string) {
    let error
    if (!value) {
      error = "Name is required"
    }
    return error
  }
  function validateDescription(value: string) {
    let error
    if (!value) {
      error = "Description is required"
    }
    return error
  }

    return (
        <div>
            <Formik initialValues={rule} onSubmit={onSubmit}>
                {() => (
                    <Form>
                        <Field name="name" style={{ paddingTop: "10px" }} validate={validateName}>
                            {({ field, form }: FieldProps) => (
                                <FormControl
                                    style={{ paddingTop: "10px" }}
                                    isRequired
                                    isInvalid={!!(form.errors.name && form.touched.name)}
                                >
                                    <FormLabel htmlFor="name">{t("guild.name")}</FormLabel>
                                    <Input {...field} id="name" placeholder="Name" />
                                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="desc" validate={validateDescription}>
                            {({ field, form }: FieldProps) => (
                                <FormControl
                                    style={{ paddingTop: "10px" }}
                                    isRequired
                                    isInvalid={!!(form.errors.desc && form.touched.desc)}
                                >
                                    <FormLabel htmlFor="desc">{t("guild.desc")}</FormLabel>
                                    <Input {...field} id="desc" placeholder="Description" />
                                    <FormErrorMessage>{form.errors.desc}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <br />
                        <Button
                            variant="with-shadow"
                            bg="#3399ff"
                            color="white"
                            size="lg"
                            height="60px"
                            type="submit"
                            width="200px"
                        >
                            {t("Save")}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


export default RuleBaseInfo

