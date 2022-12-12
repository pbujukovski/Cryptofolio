using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;

namespace Cryptofolio.Controllers
{
    public static class ControllerUtils
    {
        static public Delta<ModelToType> convertDelta<ModelFromType, ModelToType>(Delta<ModelFromType> modelDeltaFrom)
        where ModelFromType : class
        where ModelToType : class
        {
            // Iterate over all changed properies and copy to destination delta.
            Delta<ModelToType> modelDeltaTo = new Delta<ModelToType>();
            foreach (string changedPropertyName in modelDeltaFrom.GetChangedPropertyNames())
            {

                System.Diagnostics.Debug.WriteLine(changedPropertyName);
                object propertyValue;
                if (modelDeltaFrom.TryGetPropertyValue(changedPropertyName, out propertyValue))
                {
                    System.Diagnostics.Debug.WriteLine(propertyValue);
                    if (!modelDeltaTo.TrySetPropertyValue(changedPropertyName, propertyValue))
                    {

                        // TODO : Log warning.
                    }
                }
                else
                {
                    // TODO : Log warning.
                }
            }



            return modelDeltaTo;
        }
    }
}
