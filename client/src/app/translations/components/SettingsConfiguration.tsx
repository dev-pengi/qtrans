import { faGears } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { Button } from "src/components";

const SettingsConfiguration: FC = () => {
  return (
    <>
      <Button icon={faGears} variant={"primary"}>
        Settings Configurations
      </Button>
    </>
  );
};

export default SettingsConfiguration;
