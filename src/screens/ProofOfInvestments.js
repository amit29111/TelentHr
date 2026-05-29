import React from 'react';
import DeclareInvestments from './DeclareInvestments';

/** Same form as Investment Declaration — editable + file upload on each section */
const ProofOfInvestments = ({navigation, route}) => (
  <DeclareInvestments
    navigation={navigation}
    route={{
      ...route,
      params: {
        ...route?.params,
        mode: 'proof',
      },
    }}
  />
);

export default ProofOfInvestments;
